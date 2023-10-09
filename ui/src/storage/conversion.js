const wasm_ex_init = "NAND|0|1|2;NAND|2|0|1;NAND|1|2|0"
const wasm_ex_io = "010"

export const init_wasm = (gates) => {   
    return gates
        .filter(gate => !!gate)
        .map(gate => (
            [
                gate.name,
                ...gate.pins.map(pin => (
                    Object.keys(pin.wires).join(',')
                ))
            ].join('|')
        ))
        .join(';')
}

export const feed_wasm = (wires) => {
    return wires
        .map(w => w?.value ? '1' : '0')
        .join('')
}

export const read_wasm = (wires, wasm_out) => {
    for (let i = 0; i < wasm_out.length; i++) {
        wires[i].value = (wasm_out[i] === '1');
    }
}