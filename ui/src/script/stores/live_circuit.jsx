import { getDoc, upsertDoc } from "../db/db_ops";
import { pushNotif } from "./notifs";
import { ezSignal, keyGen, pinY } from "../util";
import { RecentCircuits } from "./circuits";
import { JsRunner } from "../runners/js-runner";

export class LiveGate {
  constructor(id) {
    this.id = id;
    this.createElement();

    this.gate.inPins.forEach(pid => new LivePin(pid));
    this.gate.outPins.forEach(pid => new LivePin(pid));

    LiveCircuit.objMap[id] = this;
    LiveCircuit.ref.appendChild(this.ref);
  }

  get gate() {
    return LiveCircuit.gates[this.id];
  }

  createElement() {
    this.ref = (
      <button
        onClick={this.click.bind(this)}
        onDblClick={this.doubleClick.bind(this)}
        onMouseDown={this.mouseDown.bind(this)}
        onMouseUp={_ => {}}
        class="
          absolute bg-black text-white
          flex justify-center items-center w-[100px] z-[1]
        "
        style="border-radius: 5px 15px 15px 5px;"
      />
    );
    this.retype();
  }

  click(e) {
    LiveActions.selectObject(this.id);
    e.stopPropagation();
  }

  doubleClick(e) {
    LiveActions.openGateEditor(this.id);
    e.stopPropagation();
  }

  closeEditor(e) {
    setShowEditor(false);
    e.stopPropagation();
  }

  mouseDown(e) {
    LiveActions.drag.set({
      id: this.id,
      position: this.gate.position
    });
    e.stopPropagation();
  }

  getHeight() {
    const inPinCnt = this.gate.inPins.length;
    const outPinCnt = this.gate.outPins.length;
    return 25 * Math.max(inPinCnt, outPinCnt);
  }

  reposition() {
    const height = this.getHeight();
    const [ x, y ] = this.gate.position;
    this.ref.style.left = `${x - 100 / 2}px`;
    this.ref.style.height = `${height}px`;
    this.ref.style.top = `${y - height / 2}px`;

    this.gate.inPins.forEach((pid, i) => {
      LiveCircuit.objMap[pid].reposition(-50, i, this.gate.inPins.length);
    });
    this.gate.outPins.forEach((pid, i) => {
      LiveCircuit.objMap[pid].reposition(50, i, this.gate.outPins.length);
    });
  }

  retype() {
    this.ref.textContent = this.gate.type;
  }

  select() {
    this.ref.style.outline = "2px solid white";
  }

  unselect() {
    this.ref.style.outline = "none";
  }
};

export class LivePin {
  constructor(id) {
    this.id = id;
    this.createElement();
    LiveCircuit.objMap[id] = this;
    LiveCircuit.ref.appendChild(this.ref);
  }

  get pin() {
    return LiveCircuit.pins[this.id];
  }

  createElement() {
    this.ref = (
      <button
        class="z-[2] absolute rounded-[50%]"
        onClick={this.click.bind(this)}
      >
        <div class="bg-gray-500 rounded-[50%] w-[10px] h-[10px] m-[2px]"/>
      </button>
    );
  }

  click(e) {
    e.stopPropagation();

    const newId = this.id;
    const selId = LiveActions.selection;

    // _ -> pin || pid -> pid
    if (newId === selId || !selId?.includes('pin')) {
      LiveActions.selectObject(newId);
      return;
    }

    // pin -> pin.
    LiveActions.selection = null;
    LiveCircuit.objMap[newId].unselect();
    LiveCircuit.objMap[selId].unselect();

    // from/to pin -> from/to pin
    const selIsFrom = LiveCircuit.gates[LiveCircuit.pins[selId].gate].outPins.includes(selId);
    const newIsFrom = LiveCircuit.gates[this.pin.gate].outPins.includes(newId);
    if (!(selIsFrom ^ newIsFrom)) {
      pushNotif("Wires must be from gate outputs and inputs.");
      return;
    }

    // from/to pin -> to/from pin
    if (selIsFrom) {
      LiveCircuit.addWire(selId, newId);
    } else {
      LiveCircuit.addWire(newId, selId);
    }
  }

  reposition(x, i, n) {
    const [ gx, gy ] = LiveCircuit.gates[this.pin.gate].position;
    this.x = gx + x;
    this.y = gy + pinY(n, i);
    this.ref.style.left = `${this.x - 7}px`;
    this.ref.style.top = `${this.y - 7}px`;

    this.pin.wires.forEach(wid => {
      LiveCircuit.objMap[wid].reposition();
    });
  }

  select() {
    this.ref.children[0].style.outline = "2px solid white";
  }

  unselect() {
    this.ref.children[0].style.outline = "none";
  }
};

export class LiveWire {
  constructor(id) {
    this.id = id;
    this.createElement();
    LiveCircuit.objMap[id] = this;
    LiveCircuit.ref.appendChild(this.ref);
  }

  get wire() {
    return LiveCircuit.wires[this.id];
  }

  createElement() {
    this.ref = (
      <div
        class="flex items-center z-[2] cursor-pointer absolute"
        onClick={this.click.bind(this)}
      >
        {/* left dot */}
        <div class="max-w-[5px] min-w-[5px] w-[5px] h-[5px] bg-orange-400 rounded-[2.5px]"/>
        {/* wire line */}
        <div class="h-[2px] w-full"/>
        {/* value label */}
        <div class="absolute left-[50%] top-[-20px] translate-x-[-50%] pointer-events-none"/>
        {/* right dot */}
        <div class="max-w-[5px] min-w-[5px] w-[5px] h-[5px] bg-orange-400 rounded-[2.5px]"/>
      </div>
    );
    this.recolor();
  }

  click(e) {
    e.stopPropagation();
    LiveActions.selectObject(this.id);
  }

  reposition() {
    const [ fromPid, toPid ] = this.wire.pins;
    const fromBox = LiveCircuit.objMap[fromPid];
    const toBox = LiveCircuit.objMap[toPid];
    const fromPos = [ fromBox.x, fromBox.y ];
    const toPos = [ toBox.x, toBox.y ];

    const dx = toPos[0] - fromPos[0];
    const dy = toPos[1] - fromPos[1];
    const d = Math.sqrt(dx * dx + dy * dy) + 5;
    const a = Math.atan(dy / dx);
    const left = (toPos[0] + fromPos[0]) / 2 - d / 2;
    const top = (toPos[1] + fromPos[1]) / 2 - 2.5;

    this.ref.style.transform = `rotate(${a}rad)`;
    this.ref.style.left = `${left}px`;
    this.ref.style.top = `${top}px`;
    this.ref.style.width = `${d}px`;
  }

  recolor() {
    const v = this.wire.value;
    const col = v ? "#e11d48" : "#1f2937";
    this.ref.children[1].style.backgroundColor = col;
    this.ref.children[2].textContent = v;
  }

  select() {
    this.ref.style.outline = "2px solid white";
  }

  unselect() {
    this.ref.style.outline = "none";
  }
};

export class LiveCircuit {
  static loaded = ezSignal(false);
  static gates_created = 0;

  static value = null;

  static ref = null;
  static objMap = {};

  static get wires() { return LiveCircuit.value.data.wires; }
  static get gates() { return LiveCircuit.value.data.gates; }
  static get pins() { return LiveCircuit.value.data.pins; }

  // IO

  static async load(id) {
    const doc = await getDoc("circuits", id);
    LiveCircuit.value = doc;
    LiveCircuit.loaded.set(true);

    Object.values(LiveCircuit.objMap).forEach(o => o.ref.remove());
    LiveCircuit.objMap = {};

    const gateIds = Object.keys(doc.data.gates);
    const wireIds = Object.keys(doc.data.wires);
    
    const lgs = gateIds.map(gid => new LiveGate(gid));
    wireIds.forEach(wid => new LiveWire(wid));

    lgs.forEach(lg => lg.reposition());

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
    const shift = LiveCircuit.gates_created * 60;
    const gate = {
      type: 'NAND',
      position: [200, 200 + shift],
      inPins: LiveCircuit.createPins(key, 2),
      outPins: LiveCircuit.createPins(key, 1)
    };

    LiveCircuit.gates_created++;
    LiveCircuit.gates[key] = gate;
    return [key, gate];
  }

  static createWire(fromPin, toPin) {
    const key = 'wire/' + keyGen();
    const wire = {
      pins: [fromPin, toPin],
      value: 0
    };

    LiveCircuit.pins[fromPin].wires.push(key);
    LiveCircuit.pins[toPin].wires.push(key);
    LiveCircuit.wires[key] = wire;
    return [key, wire];
  }

  // ADD

  static addGate(type) {
    const [gid, _] = LiveCircuit.createGate(type);
    const lg = new LiveGate(gid);
    lg.reposition();
    LiveActions.selectObject(gid);
  }

  static addWire(fromPin, toPin) {
    const [wid, _] = LiveCircuit.createWire(fromPin, toPin);
    const lw = new LiveWire(wid);
    lw.reposition();
    LiveActions.selectObject(wid);
  }

  static addPins(gid, num) {
    const pins = this.createPins(gid, num);
    pins.forEach(pid => new LivePin(pid));
    return pins;
  }

  // DELETE

  static deleteGate(id) {
    const pins = [
      ...LiveCircuit.gates[id].inPins,
      ...LiveCircuit.gates[id].outPins
    ];
    pins.forEach(LiveCircuit.deleteGatePin);

    delete LiveCircuit.gates[id];
    LiveCircuit.objMap[id].ref.remove();
    delete LiveCircuit.objMap[id];
  }

  static deleteGatePin(id) {
    const wires = LiveCircuit.pins[id].wires;
    wires.forEach(wid => LiveCircuit.deleteWire(wid));
    
    delete LiveCircuit.pins[id];
    LiveCircuit.objMap[id].ref.remove();
    delete LiveCircuit.objMap[id];
  }

  static deleteWire(id) {
    const pins = LiveCircuit.wires[id].pins;
    pins.forEach(pid => {
      const pin = LiveCircuit.pins[pid];
      pin.wires = pin.wires.filter(x => id !== x);
    });

    delete LiveCircuit.wires[id];
    LiveCircuit.objMap[id].ref.remove();
    delete LiveCircuit.objMap[id];
  }

  // PATCH

  static patchGate(id, patch) {
    const curr = LiveCircuit.gates[id];
    LiveCircuit.gates[id] = { ...curr, ...patch };

    const obj = LiveCircuit.objMap[id];
    if (patch.position || patch.inPins || patch.outPins) obj.reposition();
    if (patch.type) obj.retype();
  }

  static patchWire(id, patch) {
    const curr = LiveCircuit.wires[id];
    LiveCircuit.wires[id] = { ...curr, ...patch };
    LiveCircuit.objMap[id].recolor();
  }
};

export class LiveActions {
  static selection;
  static editor = ezSignal();
  static drag = ezSignal();

  static openGateEditor(id) {
    const gate = LiveCircuit.gates[id];
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

  static selectObject(id) {
    if (!LiveCircuit.objMap[id]) return;

    JsRunner.stop();

    const oid = LiveActions.selection;
    if (oid) {
      LiveCircuit.objMap[oid].unselect();
    }

    if (oid === id) {
      LiveActions.selection = null;
    } else {
      LiveActions.selection = id;
      LiveCircuit.objMap[id].select();
    }
  }

  static command(char) {
    const sel = LiveActions.selection;

    switch (char) {
      case 'd': {
        if (!sel) return;

        if (sel.includes("pin")) {
          pushNotif("To remove pins, please double click the gate.")
          return;
        }

        if (sel.includes("gate")) {
          LiveActions.selection = null;
          LiveCircuit.deleteGate(sel);
        }
        else if (sel.includes("wire")) {
          LiveActions.selection = null;
          LiveCircuit.deleteWire(sel);
        }
      }
      case 'p': { // play/pause
        JsRunner.playPause();
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
      case 'e': {
        if (!sel) return;

        if (sel.includes("gate")) {
          LiveActions.openGateEditor(sel);
        }
      }
    }
  }
};
