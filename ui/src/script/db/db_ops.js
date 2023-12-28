import { exec_cursor_transaction, exec_transaction } from "./db";

export const getAllDocs = (collection, query, count) => {
    return exec_transaction(db => (
        db.transaction([collection], "readonly")
          .objectStore(collection)
          .getAll(query, count)
    ));
};

export const getAllDocsFiltered = async (collection, index, direction, mapper, filter, stopper) => {
    return exec_cursor_transaction(
        db => (
            db.transaction([collection], "readonly")
              .objectStore(collection)
              .index(index)
              .openCursor(null, direction)
        ),
        mapper,
        filter,
        stopper
    );
};

export const getDoc = (collection, pKey) => {
    return exec_transaction(db => (
        db.transaction([collection], "readonly")
          .objectStore(collection)
          .get(pKey)
    ));
};

export const upsertDoc = (collection, doc) => {
    return exec_transaction(db => (
        db.transaction([collection], "readwrite")
          .objectStore(collection)
          .put(doc)
    ));
};

export const deleteDoc = (collection, pKey) => {
    return exec_transaction(db => (
        db.transaction([collection], "readwrite")
          .objectStore(collection)
          .delete(pKey)
    ));
};