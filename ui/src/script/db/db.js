import { upsertDoc } from "./db_ops";

const DB_NAME = "nando";
const COLLECTION_NAMES = ["circuits", "functions"];

const INIT_FUNCTIONS = [
    { name: "PROBE", fn: "a => []" },
    { name: "VCC", fn: "() => 1" },
    { name: "GND", fn: "() => 0" },
    { name: "CLK", fn: "() => JsRunner.tick % 4 == 0 ? 1 : 0" },

    { name: "NAND", fn: "(a, b) => 1 - (a & b)" },
    { name: "AND",  fn: "(a, b) => a & b" },
    { name: "NOR", fn: "(a, b) => 1 - (a | b)" },
    { name: "OR", fn: "(a, b) => a | b" },
    { name: "NOT", fn: "a => 1 - a" },
    { name: "XOR", fn: "(a, b) => a ^ b" },

    { name: "ADD", fn: "(a, b) => a + b" },
    { name: "SUB", fn: "(a, b) => a + b" },
    { name: "MULT", fn: "(a, b) => a + b" },
    { name: "DIV", fn: "(a, b) => a / b" },
    { name: "MOD", fn: "(a, b) => a % b" },
];

let db;

/**
 * @returns {Promise<IDBDatabase>}
*/
const load_db = async () => {
    if (db) return db;

    return await new Promise((res, rej) => {
        const db_req = window.indexedDB.open(DB_NAME);

        db_req.onupgradeneeded = (e) => {
            db = e.target.result;
            
            const circuitStore = db.createObjectStore("circuits", {
                autoIncrement: true,
                keyPath: "id"
            });
            circuitStore.createIndex(
                "last_updated", "last_updated",
                { unique: false }
            );

            const functionStore = db.createObjectStore("functions", {
                keyPath: "name"
            });
            INIT_FUNCTIONS.forEach(doc => functionStore.add(doc));
        };
        db_req.onsuccess = (e) => {
            db = db_req.result;
            res(db);
        };
        db_req.onerror = (e) => {
            rej();
        };
    });
};

/**
 * @param {(db: IDBDatabase) => IDBRequest<any>} transaction_cb
*/
export const exec_transaction = async (transaction_cb) => {
    const _db = await load_db();
    const req = transaction_cb(_db);

    const results = await new Promise((res, rej) => {
        req.onsuccess = e => res(e.target.result);
        req.onerror = rej;
    });
    return results;
};

export const exec_cursor_transaction = async (transaction_cb, mapper, filter, stopper) => {
    const _db = await load_db();
    const req = transaction_cb(_db);

    const results = await new Promise((res, rej) => {
        const arr = [];
        req.onsuccess = e => {
            const cursor = e.target.result;
            if (!cursor) { res(arr); return; }

            const val = mapper(cursor.value);
            if (stopper(arr, val)) { res(arr); return; }
            if (filter(val)) arr.push(val);
            cursor.continue();
        };
        req.onerror = rej;
    });
    return results;
};