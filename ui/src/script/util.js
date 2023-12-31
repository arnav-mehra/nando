import { createSignal } from "solid-js";

export const ezSignal = (v) => {
    const [ get, set ] = createSignal(v);
    return { get, set };
};

export const keyGen = () => (
    Math.random().toString(36).slice(2, 8)
);

export const clone = (obj) => (
    JSON.parse(JSON.stringify(obj))
);

export const GATE_FLEX_DATA = {
    "NAND": {
        type: 'NAND',
        position: [200, 200],
    }
};

export const PIN_FLEX_DATA = {
    "NAND": {
        wires: []
    }
};

export const PIN_HARD_DATA = {
    "NAND": {
        positions: [
            [0, 15], [0, 35], [100, 25]
        ]
    }
};

export const pinY = (n, i) => {
    const height = (n - 1) * 25;
    const start = -height / 2;
    const offset = i * 25;
    return start + offset;
}