import { deleteDoc, getAllDocs, upsertDoc } from "../db/db_ops";
import { JsRunner } from "../runners/js-runner";
import { ezSignal } from "../util";
import { pushNotif } from "./notifs";

export class GateFunctions {  
    static visible = ezSignal(false);
    static list = ezSignal();
    static fnMap = {};

    static async load() {
        const docs = await getAllDocs("functions");

        GateFunctions.list.set(docs);
        docs.forEach(({ name, fn }) => {
            GateFunctions.fnMap[name] = eval(fn);
        });
    }

    static determineIO(fn) {
        const inCnt = fn.length;
        const ins = new Array(inCnt).fill(0);
        const outs = fn(ins);
        const outCnt = Array.isArray(outs) ? outs.length : 1;
        return [ inCnt, outCnt ];
    }

    static validateFn(fn) {
        if (!fn) return null;

        try {
            var fn_var = eval(fn);
        } catch (err) {
            console.log(err);
            return null;
        }

        if (typeof fn_var !== 'function') {
            return null;
        }

        return fn_var;
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

    static async add(name, fn) {
        // validate name
        name = name.toUpperCase();
        if (name.length == 0 || name in GateFunctions.fnMap) {
            pushNotif("Error: Please enter a non-empty, unique name.");
            return;
        }

        // validate function
        const fn_var = GateFunctions.validateFn(fn);
        if (!fn_var) {
            pushNotif("Error: Invalid JS function.");
            return;
        }

        // add
        const doc = { fn, name }
        await upsertDoc("functions", doc);
        GateFunctions.fnMap[name] = fn_var;
        GateFunctions.list.set(ls => [ ...ls, doc ]);
    }

    static async update(name, fn) {
        const fn_var = GateFunctions.validateFn(fn);
        if (!fn_var) {
            pushNotif("Error: Invalid JS function.");
            return;
        }

        const doc = { name, fn };
        await upsertDoc("functions", doc);
        GateFunctions.fnMap[name] = fn_var;
        GateFunctions.list.set(ls => (
            ls.map(x => x.name === name ? doc : x)
        ));
    }

    static async remove(name) {
        await deleteDoc("functions", name);

        delete GateFunctions.fnMap[name];
        GateFunctions.list.set(ls => (
            ls.filter(d => d.name !== name)
        ));
    }
}

GateFunctions.load();