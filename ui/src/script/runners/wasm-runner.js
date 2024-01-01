class WasmRunner {
    static init_wasm() {
        // const gates = circuit.data.gates;
        // return gates
        //     .filter(gate => !!gate)
        //     .map(gate => (
        //         [
        //             gate.name,
        //             ...gate.pins.map(pin => (
        //                 Object.entries(pin.wires)
        //                       .map(([key, value]) => key + "-" + value)
        //                       .join(',')
        //             ))
        //         ].join('|')
        //     ))
        //     .join(';') + ';';
    };
    
    static feed_wasm(wires) {
        return wires
            .map(w => w?.value ? '1' : '0')
            .join('');
    };
    
    static read_wasm(wires, wasm_out) {
        for (let i = 0; i < wasm_out.length; i++) {
            wires[i].value = (wasm_out[i] === '1');
        }
    };
};