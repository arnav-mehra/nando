import { exec_transaction } from "./db";

export const getAllDocs = (collection, query, count) => {
    return exec_transaction(db => (
        db.transaction([collection], "readonly")
          .objectStore(collection)
          .getAll(query, count)
    ));
};

export const getAllKeys = (collection, index, query, count) => {
    return exec_transaction(db => (
        db.transaction([collection], "readonly")
          .objectStore(collection)
          .index(index)
          .getAllKeys(query, count)
    ));
};

export const getDoc = (collection, index, key) => {
    return exec_transaction(db => (
        db.transaction([collection], "readonly")
          .objectStore(collection)
          .index(index)
          .get(key)
    ));
};

export const getPrimaryKey = (collection, index, key) => {
    return exec_transaction(db => (
        db.transaction([collection], "readonly")
          .objectStore(collection)
          .index(index)
          .getKey(key)
    ));
};

export const upsertDoc = (collection, doc, pKey) => {
    return exec_transaction(db => (
        db.transaction([collection], "readwrite")
          .objectStore(collection)
          .put(doc, pKey)
    ));
};

export const deleteDoc = (collection, pKey) => {
    return exec_transaction(db => (
        db.transaction([collection], "readwrite")
          .objectStore(collection)
          .delete(pKey)
    ));
};