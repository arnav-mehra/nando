import { deleteDoc, getAllDocs, upsertDoc } from "../db/db_ops";
import { JsRunner } from "../runners/js-runner";
import { ezSignal } from "../util";
import { pushNotif } from "./notifs";

export class GateFunctions {  
    static visible = ezSignal(false);
    static list = ezSignal([]);
    static fnMap = {};

    static async load() {
        const docs = await getAllDocs("functions");

        docs.forEach(({ name, fn: fn_str }) => {
            const fn = eval(fn_str);
            const [ ins, outs ] = GateFunctions.determineIO(fn);
            GateFunctions.fnMap[name] = { fn, ins, outs };
        });
        GateFunctions.list.set(docs);
    }

    static async add(name, fn_str) {
        // validate name
        name = name.toUpperCase();
        if (name.length == 0 || name in GateFunctions.fnMap) {
            pushNotif("Error: Please enter a non-empty, unique name.");
            return;
        }

        // validate function
        const fn = GateFunctions.validateFn(fn_str);
        if (!fn) {
            pushNotif("Error: Invalid JS function.");
            return;
        }

        const doc = { name, fn: fn_str };
        await upsertDoc("functions", doc);

        const [ ins, outs ] = this.determineIO(fn_var);
        GateFunctions.fnMap[name] = { fn, ins, outs };
        GateFunctions.list.set(ls => [ ...ls, doc ]);
    }

    static async update(name, fn_str) {
        const fn = GateFunctions.validateFn(fn_str);
        if (!fn) {
            pushNotif("Error: Invalid JS function.");
            return;
        }

        const doc = { name, fn: fn_str };
        await upsertDoc("functions", doc);

        const [ ins, outs ] = this.determineIO(fn);
        GateFunctions.fnMap[name] = { fn, ins, outs };
        GateFunctions.list.set(ls =>
            ls.map(x => x.name === name ? doc : x)
        );

        pushNotif("Your function has been modified.")
    }

    static async remove(name) {
        await deleteDoc("functions", name);

        GateFunctions.list.set(ls => (
            ls.filter(d => d.name !== name)
        ));
        delete GateFunctions.fnMap[name];
    }

    static determineIO(fn) {
        const inCnt = fn.length;
        const ins = new Array(inCnt).fill(0);
        const outs = fn(ins);
        const outCnt = Array.isArray(outs) ? outs.length : 1;
        return [ inCnt, outCnt ];
    }

    static validateFn(fn_str) {
        if (!fn_str) return null;
        let fn;
        try {
            fn = eval(fn_str);
            GateFunctions.determineIO(fn);
        } catch (err) {
            console.log(err);
            return null;
        }
        if (typeof fn !== 'function') {
            return null;
        }
        return fn;
    }

    static validateFnFull(fn_str) {
        try {
            const fn = GateFunctions.validateFn(fn_str);
            const [ _, outs ] = GateFunctions.determineIO(fn);
            const tt = GateFunctions.genTT(fn);
            for (const { _, outputs } of tt) {
                if (outs.length !== outputs.length) {
                    console.error("Outputs do not match length.");
                    return null;
                }
            }
            return fn;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static genTT(fn) {
        const n = fn.length;
        if (n > 8) {
            pushNotif("Too many inputs to generate truth table.");
            return null; // just give up. :(
        }
        if (n == 0) {
            return [];
        }

        const res = [];
        for (let i = 0; i < (1 << n); i++) {
            const bitstr = i.toString(2).split('').map(Number);
            const lz = new Array(n - bitstr.length).fill(0);
            const input = lz.concat(bitstr);
            const output = fn(...input);
            res.push({ input, output });
        }
        return res;
    }
}

GateFunctions.load();