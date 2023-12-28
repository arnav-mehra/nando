import { createSignal } from "solid-js";
import { deleteDoc, getAllDocsFiltered, getDoc, upsertDoc } from "../db/db_ops";

export class RecentCircuits {
    static recentSignal = createSignal();
    static list = RecentCircuits.recentSignal[0];
    static setList = RecentCircuits.recentSignal[1];

    static async load() {
        const docs = await getAllDocsFiltered(
            "circuits",
            "last_updated",
            "prev",
            v => ({
                last_updated: v.last_updated,
                name: v.name,
                id: v.id
            }),
            v => true,
            (a, v) => a.length == 10
        );
        RecentCircuits.setList(docs);
    }
};

export class AllCircuits {
    static allSignal = createSignal();
    static list = AllCircuits.allSignal[0];
    static setList = AllCircuits.allSignal[1];

    static async load() {
        const docs = await getAllDocsFiltered(
            "circuits",
            "last_updated",
            "prev",
            v => ({
                last_updated: v.last_updated,
                name: v.name,
                id: v.id
            }),
            _ => true,
            _ => false
        );
        AllCircuits.setList(docs);
    }
};

export class Circuits {
    static async create() {
        const doc = {
            last_updated: Date.now(),
            name: "000000".replace(/0/g, () => (~~(Math.random()*16)).toString(16)),
            data: {
                gates: {},
                wires: {},
                pins: {}
            }
        };
        await upsertDoc("circuits", doc);
        RecentCircuits.load();
    }

    static async update(id, patch) {
        let doc = await getDoc("circuits", id);
        doc = { ...doc, ...patch };
        await upsertDoc("circuits", doc);
        RecentCircuits.load();
        return doc;
    }

    static async delete(id) {
        await deleteDoc("circuits", id);
        RecentCircuits.load();
    }

    static async download(id) {
        const downloadObject = (obj, fname) => {
            const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
            const downloadElement = document.createElement('a');
            downloadElement.setAttribute("download", fname + ".json");
            downloadElement.setAttribute("href", data);
            document.body.appendChild(downloadElement);
            downloadElement.click();
            downloadElement.remove();
        };

        const doc = await getDoc("circuits", id);
        downloadObject(doc, doc.name);
    }
};

// gates: {
//     'gate/1': {
//         type: 'NAND',
//         pins: ['pin/1', 'pin/2', 'pin/3'],
//         position: [176, 248]
//     }
// },
// wires: {
//     'wire/1': {
//         pins: ['pin/1', 'pin/2']
//     }
// },
// pins: {
//     'pin/1': {
//         position: [0, 15]
//     },
//     'pin/2': {
//         position: [0, 35]
//     },
//     'pin/3': {
//         position: [100, 25]
//     }
// }