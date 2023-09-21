import { IDB_NAME } from "../settings/types";

const db_settings = {
    name: IDB_NAME,
    version: 1,
    objectStores: [
        // for account functions
        // login, register, profile
        {
            name: 'account',
            structureSettings: {keyPath: 'id', autoIncrement: true},
            schemas: [
                {name: 'username', settings: {unique: true}},
                {name: 'email', settings: {unique: true}},
                {name: 'password', settings: {unique: false}},
            ]
        }
    ]

}

export default db_settings;