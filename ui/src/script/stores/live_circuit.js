import { getDoc, upsertDoc } from "../db/db_ops";
import { pushNotif } from "./notifs";
import { ezSignal, keyGen } from "../util";
import { RecentCircuits } from "./circuits";

export class LiveCircuit {
  static value = null;

  static gateIds = ezSignal(null);
  static wireIds = ezSignal(null);
  static gateSigs = {};
  static wireSigs = {};

  static get wires() { return LiveCircuit.value.data.wires; }
  static get gates() { return LiveCircuit.value.data.gates; }
  static get pins()  { return LiveCircuit.value.data.pins;  }

  // IO

  static async load(id) {
    const doc = await getDoc("circuits", id);
    LiveCircuit.value = doc;
    
    const gate_ents = Object.entries(doc.data.gates);
    gate_ents.forEach(([gid, gate]) => {
      LiveCircuit.gateSigs[gid] = ezSignal(gate);
    });
    const wire_ents = Object.entries(doc.data.wires);
    wire_ents.forEach(([wid, wire]) => {
      LiveCircuit.wireSigs[wid] = ezSignal(wire);
    });
    LiveCircuit.gateIds.set(Object.keys(doc.data.gates));
    LiveCircuit.wireIds.set(Object.keys(doc.data.wires));

    pushNotif("Loaded circuit " + LiveCircuit.value.name + "!");
  }
 
  static async save() {
    const doc = LiveCircuit.value;
    doc.last_updated = Date.now();
    await upsertDoc("circuits", doc);
    RecentCircuits.load();
    pushNotif("Saved circuit " + LiveCircuit.value.name + "!");
  };

  // CREATE

  static createPins(gid, num) {
    return new Array(num).fill().map(_ => {
      const key = 'pin/' + keyGen();
      const pin = { wires: [], gate: gid };

      LiveCircuit.pins[key] = pin;
      return key;
    });
  }

  static createGate() {
    const key = 'gate/' + keyGen();
    const gate = {
      type: 'NAND',
      position: [200, 200],
      inPins: LiveCircuit.createPins(key, 2),
      outPins: LiveCircuit.createPins(key, 1)
    };

    LiveCircuit.gates[key] = gate;
    return [ key, gate ];
  }

  static createWire(fromPin, toPin) {
    const key = 'wire/' + keyGen();
    const wire = {
      pins: [ fromPin, toPin ],
      value: 0
    };

    LiveCircuit.pins[fromPin].wires.push(key);
    LiveCircuit.pins[toPin].wires.push(key);
    LiveCircuit.wires[key] = wire;
    return [ key, wire ];
  }

  // ADD

  static addGate(type) {
    const [ gid, gate ] = LiveCircuit.createGate(type);
    LiveCircuit.gateSigs[gid] = ezSignal(gate);
    console.log(LiveCircuit.gateSigs[gid].get())
    LiveCircuit.gateIds.set(arr => [ ...arr, gid ]);
  }

  static addWire(fromPin, toPin) {
    const [ wid, wire ] = LiveCircuit.createWire(fromPin, toPin);
    LiveCircuit.wireSigs[wid] = ezSignal(wire);
    LiveCircuit.wireIds.set(arr => [ ...arr, wid ]);
  }

  // DELETE

  static deleteGate(id) {
    const pins = [
      ...LiveCircuit.gates[id].inPins,
      ...LiveCircuit.gates[id].outPins
    ];
    pins.forEach(LiveCircuit.deleteGatePin);

    delete LiveCircuit.gates[id];
    delete LiveCircuit.gateSigs[id];
    LiveCircuit.gateIds.set(arr => arr.filter(x => id !== x));
  }

  static deleteGatePin(id) {
    const wires = LiveCircuit.pins[id].wires;
    wires.forEach(wid => LiveCircuit.deleteWire(wid));
    delete LiveCircuit.pins[id];
  }

  static deleteWire(id) {
    const pins = LiveCircuit.wires[id].pins;
    pins.forEach(pid => {
      const pin = LiveCircuit.pins[pid];
      pin.wires = pin.wires.filter(x => id !== x);
    });

    delete LiveCircuit.wires[id];
    delete LiveCircuit.wireSigs[id];
    LiveCircuit.wireIds.set(arr => arr.filter(x => id !== x));
  }

  // PATCH

  static patchGate(id, patch) {
    LiveCircuit.gateSigs[id].set(gate => {
      const res = {
        ...gate,
        ...patch
      };
      LiveCircuit.gates[id] = res;
      return res;
    });
  }

  static patchWire(id, patch) {
    LiveCircuit.wireSigs[id].set(wire => {
      const res = {
        ...wire,
        ...patch
      };
      LiveCircuit.wires[id] = res;
      return res;
    });
  }
};

export class LiveActions {
  static selection = ezSignal();
  static editor = ezSignal();

  static openGateEditor(id, gate) {
    LiveActions.editor.set({
      id,
      type: gate.type,
      numInPins: gate.inPins.length,
      numOutPins: gate.outPins.length
    });
  }

  static closeGateEditor() {
    LiveActions.editor.set(null);
  }

  // static saveGateEdit(id) {

  // }

  static selectGate(id) {
    LiveActions.selection.set(s => (
      s?.id === id ? null : { id, type: 'gate' }
    ));
  }

  static selectWire(id) {
    LiveActions.selection.set(s => (
      s?.id === id ? null : { id, type: 'wire' }
    ));
  }

  static selectPin(id) {
    const sel = LiveActions.selection.get();

    // unclick.
    if (sel?.id == id) {
      LiveActions.selection.set(null);
      return;
    }

    // !pin -> pin
    if (sel?.type != "pin") {
      LiveActions.selection.set({ id, type: 'pin' });
      return;
    }

    // from/to pin -> from/to pin
    LiveActions.selection.set(null);
    const selIsFrom = LiveCircuit.gates[LiveCircuit.pins[sel.id].gate].outPins.includes(sel.id);
    const newIsFrom = LiveCircuit.gates[LiveCircuit.pins[id].gate].outPins.includes(id);
    if (!(selIsFrom ^ newIsFrom)) {
      pushNotif("Wires must be from gate outputs to inputs.");
      return;
    }

    // from/to pin -> to/from pin
    if (selIsFrom) {
      LiveCircuit.addWire(sel.id, id);
    } else {
      LiveCircuit.addWire(id, sel.id);
    }
  }

  static command(char) {
    switch (char) {
      case 'd': {
        const sel = LiveActions.selection.get();
        LiveActions.selection.set(null);
        switch (sel?.type) {
          case 'gate': LiveCircuit.deleteGate(sel.id); break;
          case 'wire': LiveCircuit.deleteWire(sel.id); break;
          case 'pin': break;
        }
        break;
      }
      case 'p': { // play/pause
        console.log(init_wasm(LiveCircuit.value.data.gates))
        console.log(feed_wasm(LiveCircuit.value.data.wires))
        break;
      }
      case 's': { // save
        LiveCircuit.save();
        break;
      }
      case 'i': { // info
        console.log(LiveCircuit.value);
        break;
      }
    }
  }
};
