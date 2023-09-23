import { IDB_NAME } from "../settings/types";

export const db_settings = {
    name: IDB_NAME,
    version: 1,
    latestVersion: 2,
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

export const db_upgrade = [
    {
        version: 2,
        fromVersion: 1,
        upgradeObjStores: [
            { name: 'account', newSchemas: [{name: 'avatar', settings: {unique: false}}] }
        ]
    }
]