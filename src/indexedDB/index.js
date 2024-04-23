import { db_settings } from "./settings";
import { IDB_CMD_NEW, IDB_CMD_UPDATE, IDB_MODE_READONLY, IDB_MODE_READWRITE, IDB_NAME } from "../settings/types";
import { toast } from "react-toastify";

let db = null;
let languagePack = {};

export function updateLanguagePack(langpk) {
    languagePack = langpk;
}

export function initDB(manual = false) {
    return new Promise(resolve => {
        // find latest version
        let latestVersion = Math.max(...db_settings.idbVersions.map(e=>e.version));
        const db_request = window.indexedDB.open(db_settings.name, latestVersion);

        db_request.onsuccess = function() {
            db = this.result;
            manual && toast.info(languagePack['init-idb-success']);
            resolve(true);
        }

        db_request.onerror = function() {
            db = null;
            toast.error(this.error);
            resolve(null);
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
                            objStoreAttr.rmSchemas && objStoreAttr.rmSchemas.forEach(schema=>{
                                store.deleteIndex(schema);
                            })
                            objStoreAttr.newSchemas && objStoreAttr.newSchemas.forEach(schema=>{
                                store.createIndex(schema.name, schema.name, schema.settings || {});
                            })
                        }
                    })
                }
            })
        }
    })
}

function getObjStore(name, mode) {
    try {
        return db.transaction(name, mode).objectStore(name);
    } catch(error) {
        toast.error(error);
    }
}

// CRUD

export function insert(storeName, data) {
    return new Promise(resolve => {
        try {
            const req = getObjStore(storeName, IDB_MODE_READWRITE).add(data);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        } catch (error) {
            toast.error(error.message);
            resolve(null);
        }
    })
}

export function getOne(storeName, get_query, exclude = null) {
    return new Promise(async resolve => {
        try {
            const store = getObjStore(storeName, IDB_MODE_READONLY);
            if(store.keyPath in get_query) {
                resolve(await getByID(storeName, get_query[store.keyPath], get_query, exclude, store))
            } else {
                const get_query_key_pairs = 
                Object.keys(get_query)
                .map(key=>{return {key, value: get_query[key]}})
                // get by the first provided key in get_query
                const req = store.index(get_query_key_pairs[0].key);
                req.openCursor().onsuccess = evt => {
                    const cursor = evt.target.result;
                    if(cursor) {
                        const result = cursor.value;
                        for(const { key, v } of get_query_key_pairs) {
                            if(v !== result[key]) {
                                // if not match, go to next record
                                cursor.continue();
                                return;
                            }
                        }
                        // all matched, do else
                        exclude && exclude.forEach(e=>delete result[e]);
                        resolve(result);
                    } else {
                        // all results not match
                        resolve(null);
                    }
                }

                req.onerror = error => {
                    toast.error(error);
                    resolve(null);
                }
            }
        } catch(error) {
            toast.error(error);
            resolve(null)
        }
    })
}

export function getAll(storeName, validate = null, exclude = null, store = null) {
    return new Promise(resolve => {
        try {
            store = store || getObjStore(storeName, IDB_MODE_READONLY);
            const req = store.getAll();
            
            req.onsuccess = () => {
                let results = req.result;
                if(validate) {
                    results = results.filter(entry => {
                        let matched = true;
                        for(const key in validate) {
                            if(entry[key] !== validate[key]) {
                                matched = false;
                                break;
                            }
                        }
                        return matched;
                    })
                }
                if(exclude) {
                    for(let i = 0; i < results.length; i++) {
                        exclude.forEach(e=>delete results[i][e]);
                    }
                }

                resolve(results)
            }

            req.onerror = () => resolve([])
        } catch (error) {
            toast.error(error);
            resolve(null);
        }
    })
}

export function getByID(storeName, id, validate = null, exclude = null, store = null) {
    return new Promise(resolve => {
        try {
            store = store || getObjStore(storeName, IDB_MODE_READONLY);
            const req = store.get(id);
        
            req.onsuccess = function() {
                const result = this.result;
                if(result && validate) {
                    for(const key in validate) {
                        if(result[key] !== validate[key]) {
                            resolve(null)
                            return;
                        }
                    }
                }
                result && exclude && exclude.forEach(e=>delete result[e]);
                resolve(result);
            }
            req.onerror = () => resolve(null);
        } catch (error) {
            toast.error(error.message);
            resolve(null);
        }
    })
}

export function update(storeName, record_with_id, update_query) {
    return new Promise(resolve => {
        try {
            const store = getObjStore(storeName, IDB_MODE_READWRITE);
            const req = store.put({...record_with_id, ...update_query});
            req.onsuccess = () => resolve(true);
            req.onerror = () => resolve(null);
        } catch(error) {
            toast.error(error.message);
            resolve(null);
        }
    })
}

export function deleteByID(storeName, id) {
    return new Promise(resolve => {
        try {
            const store = getObjStore(storeName, IDB_MODE_READWRITE);
            const req = store.delete(id);
            req.onsuccess = () => resolve(true);
            req.onerror = () => resolve(null);
        } catch (error) {
            toast.error(error.message);
            resolve(null);
        }
    })
}

export function deleteAllByColumn(storeName, delete_query = null) {
    return new Promise(async resolve => {
        try {
            if(!delete_query) resolve(await clearAll(storeName));
            else {
                const store = getObjStore(storeName, IDB_MODE_READWRITE);
                const key = store.keyPath;
                const results = await getAll(storeName, delete_query, null, store);
                
                let delete_count = results.length;
                results.forEach(result =>{
                    const req = store.delete(result[key]);
                    req.onsuccess = () => {
                        if(-- delete_count === 0) {
                            resolve(true);
                        }
                    }
                    req.onerror = error => {
                        toast.error(error);
                        resolve(null);
                    }
                })
            }
        } catch (error) {
            toast.error(error.message);
            resolve(null);
        }
    })
}

export function clearAll(storeName) {
    return new Promise(resolve => {
        try {
            const req = getObjStore(storeName, IDB_MODE_READWRITE).clear();
            req.onsuccess = () => {
                toast.info(languagePack['clear-table-success'](storeName));
                resolve(true);
            }
            req.onerror = () => {
                toast.info(languagePack['clear-table-fail'](storeName));
                resolve(null);
            }
        } catch (error) {
            toast.error(error.message);
            resolve(null);
        }
    })
}

export function deleteDB() {
    return new Promise(resolve => {
        if(db) db.close()
        const req = window.indexedDB.deleteDatabase(IDB_NAME);
        req.onsuccess = () => {toast.info(languagePack['del-idb-success']); resolve(true)}
        req.onerror = () => {toast.error(languagePack['del-idb-fail']); resolve(null)}
    })
}