import { IDB_ACCOUNT, IDB_CMD_NEW, IDB_CMD_UPDATE, IDB_NAME } from "../settings/types";

export const db_settings = {
    name: IDB_NAME,
    idbVersions: [
        {
            version: 1,
            objectStores: [
                {
                    // for account functions
                    // login, register, profile
                    command: IDB_CMD_NEW,
                    name: IDB_ACCOUNT,
                    structureSettings: { keyPath: 'id', autoIncrement: true },
                    schemas: [
                        {name: 'username', settings: { unique: true } },
                        {name: 'email', settings: { unique: true } },
                        {name: 'password'},
                    ]
                }
            ]
        },
        {
            version: 2,
            objectStores: [
                {
                    command: IDB_CMD_UPDATE,
                    name: IDB_ACCOUNT,
                    newSchemas: [
                        { name: 'avatar' }
                    ]
                }
            ]
        }
    ]
}