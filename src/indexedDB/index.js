import db_settings from "./settings";
import { IDB_MODE_READONLY, IDB_MODE_READWRITE, IDB_NAME } from "../settings/types";

let db = null;
let error = null;

export function initDB() {
    
    const setting = db_settings;
    const db_request = indexedDB.open(setting.name, setting.version);

    db_request.onsuccess = function() {
        error = null;
        db = this.result;
    }

    db_request.onerror = function() {
        // console.error(event.target);
        db = null;
        error = this.error;
        // just throw this error
        throw new Error(error);
    }

    db_request.onupgradeneeded = function (event) {
        const currDB = event.currentTarget.result;
        setting.objectStores.forEach(objStoreAttr=>{
            const objStore = currDB.createObjectStore(objStoreAttr.name, objStoreAttr.structureSettings);
            objStoreAttr.schemas.forEach(schema=>{
                objStore.createIndex(schema.name, schema.name, schema.settings);
            })
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
        if(!db) throw new Error('Open db timeout (500ms), please consider try again.');
    }
    return db.transaction(name, mode).objectStore(name);
}

// CRUD

export async function insert(storeName, data, callback) {
    const req = await getObjStore(storeName, IDB_MODE_READWRITE).add(data);
    req.onsuccess = () => callback(true);
    req.onerror = () => callback(false);
}

export async function selectOneByColumn(storeName, query, callback) {
    const store = await getObjStore(storeName, IDB_MODE_READONLY);
    const req = store.index(query.indexName);
    req.index(query.indexValue).onsuccess = function() {
        const queryResult = this.result;
        if(query.compareTo) {
            let isMatch = true;
            for(const key in query.compareTo) {
                if(queryResult[key] !== query.compareTo[key]) {
                    isMatch = false;
                    break;
                }
            }
            callback(isMatch);
        } else callback(queryResult);
    }

    req.onerror = () => callback(false);
}

export async function selectAllByColumn(storeName, query, callback, store = null) {
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
                    if(isMatch) queryResults.push(result)
                }
            }
            cursor.continue();
        } else {
            callback(queryResults)
        }
    }

    req.onerror = () => callback(false);
}

export async function getByKeyPath(storeName, key, callback, store = null) {
    store = store || await getObjStore(storeName, IDB_MODE_READONLY);
    const req = store.get(key);

    req.onsuccess = evt => callback(evt.target.result);
    req.onerror = () => callback(false);
}

export async function deleteByKeyPath(storeName, key, callback) {
    const store = await getObjStore(storeName, IDB_MODE_READWRITE);
    getByKeyPath(storeName, key, exist => {
        if(exist) {
            const req = store.delete(key);
            req.onsuccess = () => callback(true);
            req.onerror = () => callback(false);
        } else callback(false);
    }, store);
}

export async function deleteAllByColumn(storeName, query, callback) {
    const store = await getObjStore(storeName, IDB_MODE_READWRITE);
    selectAllByColumn(storeName, query, results => {
        if(results) {
            results.forEach(e=>{
                store.delete(e.key);
            })
            callback(true);
        } else callback(false);
    }, store)
}

export async function clearAll(storeName, callback) {
    const req = await getObjStore(storeName, IDB_MODE_READWRITE).clear();
    req.onsuccess = () => callback(true);
    req.onerror = () => callback(false);
}

export function deleteDB() {
    if(db) db.close()
    const req = indexedDB.deleteDatabase(IDB_NAME);
    req.onsuccess = () => console.log(`Delete DB ${IDB_NAME} success!`)
    req.onerror = () => console.error(`Delete DB ${IDB_NAME} unsuccess!`)
}