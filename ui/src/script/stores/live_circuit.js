import { createMemo, createSignal } from "solid-js";
import { getDoc, upsertDoc } from "../db/db_ops";
import { pushNotif } from "./notifs";
import { GATE_FLEX_DATA, PIN_FLEX_DATA, PIN_HARD_DATA, clone, ezSignal, keyGen } from "../util";

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
    await upsertDoc("circuits", doc);
    pushNotif("Saved circuit " + LiveCircuit.value.name + "!");
  };

  // CREATE

  static createPins(gid, type) {
    return PIN_HARD_DATA[type].positions.map(_ => {
      const key = 'pin/' + keyGen();
      const pin = clone(PIN_FLEX_DATA[type]);
      pin.gate = gid;

      LiveCircuit.pins[key] = pin;
      return key;
    });
  }

  static createGate(type) {
    const key = 'gate/' + keyGen();
    const gate = clone(GATE_FLEX_DATA[type]);
    gate.pins = LiveCircuit.createPins(key, type);

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
    const pins = LiveCircuit.gates[id].pins;
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
    LiveCircuit.gateSigs[id].set(gate => ({
      ...gate,
      ...patch
    }));
  }

  static patchWire(id, patch) {
    LiveCircuit.wireSigs[id].set(wire => ({
      ...wire,
      ...patch
    }));
  }
};

export class LiveActions {
  static selection = ezSignal();

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
    if (sel?.type === "pin") {
      LiveActions.selection.set(null);
      if (id !== sel) {
        LiveCircuit.addWire(id, sel.id);
      }
    }
    else {
      LiveActions.selection.set({ id, type: 'pin' });
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
        break;
      }
    }
  }
};
