import { createSignal } from "solid-js";

export const [ circuit, setCircuit ] = createSignal(null);

export const saveLocalCircuit = (save) => {
  localStorage.setItem(
      save.meta.id,
      JSON.stringify(save)
  );
};

export const circuitOps = {
    deleteWire: (w) => {
      const copy = { ...circuit() }

      const wire = copy.data.wires[w]
      const fromGate = copy.data.gates[wire.from.gate]
      const toGate = copy.data.gates[wire.to.gate]
      const fromPin = fromGate.pins[wire.from.pin]
      const toPin = toGate.pins[wire.to.pin]
      console.log(fromPin.wires, toPin.wires)

      delete fromPin.wires[w]
      delete toPin.wires[w]
      copy.data.wires[w] = null
      setCircuit(copy)
    },
    deleteGate: (g) => {
      const copy = { ...circuit() }
      console.log(copy)
      console.log(g)

      const pins = copy.data.gates[g].pins
      pins.forEach(pin => {
        Object.keys(pin.wires).forEach(w => {
          copy.data.wires[w] = null
        })
      })
      copy.data.gates[g] = null
      setCircuit(copy)
    },
    addGate: (gateName) => {
      const gate = JSON.parse(JSON.stringify(GATE_DATA[gateName]))        
      const copy = { ...circuit() }
      copy.data.gates = [ ...copy.data.gates, gate ]
      setCircuit(copy)
      console.log(copy)
    },
    addWire: (newWire) => {
      const fromPin = circuit().data.gates[newWire.from.gate].pins[newWire.from.pin]
      const toPin = circuit().data.gates[newWire.to.gate].pins[newWire.to.pin]
      
      const copy = { ...circuit() }
      copy.data.wires = [ ...copy.data.wires, newWire ]
      const newWireNum = copy.data.wires.length - 1;
      fromPin.wires[newWireNum] = 1;
      toPin.wires[newWireNum] = 1;
      setCircuit(copy)
    },
    save: () => {
      try {
        console.log(circuit())
        console.log(init_wasm(circuit()))
        saveLocalCircuit(circuit());
        pushNotif("Saved circuit " + circuit().meta.name + "!");
      } catch (err) {
        console.log({ err });
        pushNotif("Error: Unable to save circuit.");
      }
    }
  }

  const GATE_DATA = {
    "NAND": {
      name: 'NAND',
      width: 100,
      height: 50,
      position: [ 200, 200 ],
      pins: [
        {
          wires: {},
          position: [ 0, 15 ]
        },
        {
          wires: {},
          position: [ 0, 35 ]
        },
        {
          wires: {},
          position: [ 100, 25 ]
        }
      ]
    }
  }