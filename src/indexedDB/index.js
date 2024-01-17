import { db_settings } from "./settings";
import { IDB_CMD_NEW, IDB_CMD_UPDATE, IDB_MODE_READONLY, IDB_MODE_READWRITE, IDB_NAME } from "../settings/types";
import { toast } from "react-toastify";

let db = null;
let languagePack = {};

export function updateLanguagePack(langpk) {
    languagePack = langpk;
}

export function initDB(manual = false) {
    // find latest version
    let latestVersion = Math.max(...db_settings.idbVersions.map(e=>e.version));
    const db_request = window.indexedDB.open(db_settings.name, latestVersion);

    db_request.onsuccess = function() {
        db = this.result;
        if(manual)
            toast.info(languagePack['init-idb-success']);
    }

    db_request.onerror = function() {
        db = null;
        toast.error(this.error);
    }

    db_request.onupgradeneeded = function (evt) {
        const currDB = evt.currentTarget.result;
        db_settings.idbVersions.forEach(idbVersion => {
            if(evt.oldVersion < idbVersion.version) {
                idbVersion.objectStores.forEach(objStoreAttr => {
                    if(objStoreAttr.command === IDB_CMD_NEW) {
                        const objStore = currDB.createObjectStore(objStoreAttr.name, objStoreAttr.structureSettings);
                        objStoreAttr.schemas.forEach(schema=>{
                            objStore.createIndex(schema.name, schema.name, schema.settings || {});
                        })
                    } else if(objStoreAttr.command === IDB_CMD_UPDATE) {
                        const store = db_request.transaction.objectStore(objStoreAttr.name);
                        objStoreAttr.newSchemas && objStoreAttr.newSchemas.forEach(schema=>{
                            store.createIndex(schema.name, schema.name, schema.settings || {});
                        })
                        objStoreAttr.rmSchemas && objStoreAttr.rmSchemas.forEach(schema=>{
                            store.deleteIndex(schema);
                        })
                    }
                })
            }
        })
    }
}

async function getObjStore(name, mode) {
    if(!db) {
        let count = 0;
        // wait for db to be ready, max 500ms
        while(!db && count < 5) {
            await new Promise(s=>setTimeout(s, 100));
            count ++;
        }
        if(!db) throw new Error(
            languagePack['open-idb-timeout']
        );
    }
    return db.transaction(name, mode).objectStore(name);
}

// CRUD

export async function insert(storeName, data, callback) {
    try {
        const req = (await getObjStore(storeName, IDB_MODE_READWRITE)).add(data);
        req.onsuccess = () => callback(true);
        req.onerror = () => callback(false);
    } catch (error) {
        toast.error(error.message);
        callback(false);
    }
}

export async function selectOneByColumn(storeName, query, callback) {
    try {
        const store = await getObjStore(storeName, IDB_MODE_READONLY);
        const req = store.index(query.indexName);
        req.get(query.indexValue).onsuccess = function() {
            const queryResult = this.result;
            if(!queryResult) {
                callback(false);
                return;
            }
            if(query.compareTo) {
                for(const key in query.compareTo) {
                    if(queryResult[key] !== query.compareTo[key]) {
                        callback(false);
                        return;
                    }
                }
            }
            query.exclude && query.exclude.forEach(e=>delete queryResult[e]);

            callback(queryResult);
        }

        req.onerror = () => callback(false);
    } catch (error) {
        toast.error(error.message);
    }
}

export async function selectAllByColumn(storeName, query, callback, store = null) {
    try {
        store = store || await getObjStore(storeName, IDB_MODE_READONLY);
        const req = store.openCursor()
    
        const queryResults = []
    
        req.onsuccess = function() {
            const cursor = this.result;
            if(cursor) {
                const resultReq = store.get(cursor.key);
                resultReq.onsuccess = function() {
                    const result = this.result;
                    if(result) {
                        let isMatch = true;
                        for(const key in query) {
                            if(result[key] !== query[key]) {
                                isMatch = false;
                                break;
                            }
                        }
                        if(isMatch){
                            if(query.exclude)
                                query.exclude.forEach(e=>delete result[e]);
                            queryResults.push(result)
                        }
                    }
                }
                cursor.continue();
            } else {
                callback(queryResults)
            }
        }
    
        req.onerror = () => callback(false);
    } catch (error) {
        toast.error(error.message);
        callback(false);
    }
}

export async function getByKeyPath(storeName, key, callback, extra = {store: null, exclude: null, compareTo: null}) {
    try {
        let { store, exclude, compareTo } = extra
        store = store || await getObjStore(storeName, IDB_MODE_READONLY);
        const req = store.get(key);
    
        req.onsuccess = function() {
            const result = this.result;
            if(result && compareTo) {
                for(const index in compareTo) {
                    if(result[index] !== compareTo[index]) {
                        callback(false)
                        return;
                    }
                }
            }
            result && exclude && exclude.forEach(e=>delete result[e]);
            callback(result);
        }
        req.onerror = () => callback(false);
    } catch (error) {
        toast.error(error.message);
        callback(false);
    }
}

export async function update(storeName, query, callback) {
    try {
        const store = await getObjStore(storeName, IDB_MODE_READWRITE);
        getByKeyPath(storeName, query.id, result=>{
            if(result) {
                for(const key in query.updateQuery) {
                    result[key] = query.updateQuery[key];
                }
                const req = store.put(result);

                req.onsuccess = () => callback(true);
                req.onerror = () => callback(false);
            }
        }, {store})
    } catch(error) {
        toast.error(error.message);
        callback(false);
    }
}

export async function deleteByKeyPath(storeName, key, callback) {
    try {
        const store = await getObjStore(storeName, IDB_MODE_READWRITE);
        getByKeyPath(storeName, key, exist => {
            if(exist) {
                const req = store.delete(key);
                req.onsuccess = () => callback(true);
                req.onerror = () => callback(false);
            } else callback(false);
        }, {store});
    } catch (error) {
        toast.error(error.message);
        callback(false);
    }
}

export async function deleteAllByColumn(storeName, query, callback) {
    try {
        const store = await getObjStore(storeName, IDB_MODE_READWRITE);
        selectAllByColumn(storeName, query, results => {
            if(results) {
                results.forEach(e=>{
                    store.delete(e.key);
                })
                callback(true);
            } else callback(false);
        }, store)
    } catch (error) {
        toast.error(error.message);
        callback(false);
    }
}

export async function clearAll(storeName, callback) {
    try {
        const req = (await getObjStore(storeName, IDB_MODE_READWRITE)).clear();
        req.onsuccess = () => {
            toast.info(languagePack['clear-table-success'](storeName));
            callback(true);
        }
        req.onerror = () => {
            toast.info(languagePack['clear-table-fail'](storeName));
            callback(false);
        }
    } catch (error) {
        toast.error(error.message);
        callback(false);
    }
}

export function deleteDB() {
    if(db) db.close()
    const req = window.indexedDB.deleteDatabase(IDB_NAME);
    req.onsuccess = () => {toast.info(languagePack['del-idb-success'])}
    req.onerror = () => toast.error(languagePack['del-idb-fail'])
}