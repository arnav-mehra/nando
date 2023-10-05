const wasm_ex_init = "NAND,0,1,2 NAND,2,0,1 NAND,1,2,0"
const wasm_ex_io = "010"

export const init_wasm = (gates) => {    
    let wasm_in = "";
    for (const gate of gates) {
        wasm_in += gate.name + ','
                + gate.pins[0].wire + ','
                + gate.pins[1].wire + ','
                + gate.pins[2].wire + ' ';
    }
    wasm_in = wasm_in.trimEnd();
    return wasm_in;
}

export const feed_wasm = (wires) => {
    let wasm_in = "";
    for (const w of wires) {
        wasm_in += (w.value ? "1" : "0");
    }
    return wasm_in;
}

export const read_wasm = (wires, wasm_out) => {
    for (let i = 0; i < wasm_out.length; i++) {
        wires[i].value = (wasm_out[i] === '1');
    }
}