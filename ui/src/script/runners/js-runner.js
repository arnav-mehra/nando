import { GateFunctions } from "../stores/functions";
import { LiveCircuit } from "../stores/live_circuit";
import { ezSignal } from "../util";

export class JsRunner {
    static play = ezSignal(false);

    static playPause() {
        JsRunner.play.set(p => !p);

        if (JsRunner.play.get()) {
            JsRunner.init();
        }
    }

    static init() {
        const data = LiveCircuit.value.data;
        const updates = [];

        Object.values(data.gates).forEach(g => {
            const inPins = g.inPins.map(pid => data.pins[pid]);
            const outPins = g.outPins.map(pid => data.pins[pid]);

            const ins = inPins.map(pin => 
                pin.wires
                    .map(wid => data.wires[wid].value)
                    .reduce((v, x) => (v | x), 0)
            );
            const fn = GateFunctions.fnMap[g.type];
            let outs = fn(...ins);
            outs = Array.isArray(outs) ? outs : [ outs ];

            outPins.forEach((pin, i) => {
                pin.wires
                    .map(wid => [wid, outs[i]])
                    .forEach(x => updates.push(x));
            });
        });

        updates.forEach(([wid, value]) => {
            LiveCircuit.patchWire(wid, { value });
        })

        // const idx_map = {};
        // Object.keys(data.gates).forEach((id, i) => idx_map[id] = i);
        // Object.keys(data.pins).forEach((id, i) => idx_map[id] = i);
        // Object.keys(data.wires).forEach((id, i) => idx_map[id] = i);

        // const gates = Object.values(data.gates).map(g => ([
        //     g.type,
        //     ...g.pins.map(id => idx_map[id])
        // ]));
        // const pins = Object.values(data.pins).map(p => ([
        //     idx_map[p.gate],
        //     ...p.wires.map(id => idx_map[id])
        // ]));
        // const wires = Object.values(data.wires).map(w => ([
        //     w.value,
        //     ...w.pins.map(id => idx_map[id])
        // ]));

        // console.log({gates, pins, wires});
    }
};