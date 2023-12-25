const DB_NAME = "nando";
const COLLECTION_NAMES = ["circuits"];
let db;

/**
 * @returns {Promise<IDBDatabase>}
*/
const load_db = async () => {
    if (db) return db;

    return await new Promise((res, rej) => {
        const db_req = window.indexedDB.open(DB_NAME);

        db_req.onupgradeneeded = (e) => {
            const _db = e.target.result;
            
            const circuitStore = _db.createObjectStore("circuits", {
                autoIncrement: true
            });
            circuitStore.createIndex(
                "last_updated", "last_updated",
                { unique: false }
            );
            circuitStore.createIndex(
                "name", "name",
                { unique: true }
            );
            circuitStore.createIndex(
                "name, last_updated", ["name", "last_updated"],
                { unique: true }
            );
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