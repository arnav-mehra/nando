import { GateFunctions } from "../stores/functions";
import { LiveCircuit } from "../stores/live_circuit";
import { ezSignal } from "../util";

// Perf Log:
//   V0 Runtime: 1M iter / ~1730ms = 0.58k/s. circuit: "cd2db7".
//      Improvement: compiled io and fn into preprepped array for iter.
//   V1 Runtime: 1M iter / ~680ms  = 1.47m/s. circuit: "cd2db7".
//      Improvement: replaced map, reduce, etc. with for-loops.
//   V2 Runtime: 1M iter / ~380ms  = 2.63m/s. circuit: "cd2db7".

export class JsRunner {
    static play = ezSignal(false);
    static interval = null;
    static tick = 0;

    static playPause() {
        JsRunner.play.set(p => !p);

        if (JsRunner.play.get()) {
            JsRunner.run();
        } else {
            JsRunner.stop();
        }
    }

    static stop() {
        clearInterval(JsRunner.interval);
        JsRunner.interval = null;
    }

    static run() {
        const data = LiveCircuit.value.data;
        const { gates, wires, pins } = data;
        const gateList = Object.values(gates);

        const comp = gateList.map(g => {
            const inPins = g.inPins.map(pid => pins[pid]);
            const outPins = g.outPins.map(pid => pins[pid]);

            const ins = inPins.map(pin => 
                pin.wires.map(wid => wires[wid])
            );
            const fn = GateFunctions.fnMap[g.type].fn;
            const [ _, outCnt ] = GateFunctions.determineIO(fn);
            const ffn = outCnt == 1 ? x => [ fn(x) ] : fn;

            const outs = outPins.map(pin =>
                pin.wires.map(wid => LiveCircuit.objMap[wid])
            );

            return [ ins, ffn, outs ];
        });

        JsRunner.interval = setInterval(_ => {
            JsRunner.iter(comp);
            JsRunner.tick++;
        }, 1000);

        // const ti = Date.now();
        // for (let i = 0; i < 1000000; i++) {
        //     JsRunner.iter(comp);
        // }
        // const tf = Date.now();
        // console.log(tf - ti);
    }

    static iter(comp) {
        

        for (const [inC, fnC, outC] of comp) {
            const ins = [];
            for (const wires of inC) {
                let r = 0;
                for (const wire of wires) {
                    r |= wire.value;
                }
                ins.push(r);
            }
            const outs = fnC(...ins);
            
            const l = outC.length;
            for (let i = 0; i < l; i++) {
                const v = outs[i];
                for (const lw of outC[i]) {
                    lw.wire.value = v;
                    lw.recolor();
                }
            }
        }
    }
};