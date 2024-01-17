import { IDB_ACCOUNT, IDB_CMD_NEW, IDB_CMD_UPDATE, IDB_NAME, IDB_STOCK_HISTORY, IDB_STOCK_ITEM, IDB_STOCK_OPERATOR } from "../settings/types";

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
        },
        {
            version: 3,
            objectStores: [
                // for stock management function
                {
                    command: IDB_CMD_NEW,
                    name: IDB_STOCK_ITEM,
                    structureSettings: { keyPath: 'id', autoIncrement: true },
                    schemas: [
                        { name: 'itemName', settings: { unique: true } },
                        { name: 'itemStock' },
                        { name: 'itemPrice' }
                    ]
                },
                {
                    command: IDB_CMD_NEW,
                    name: IDB_STOCK_OPERATOR,
                    structureSettings: { keyPath: 'id', autoIncrement: true },
                    schemas: [
                        { name: 'operatorName' },
                        { name: 'operatorStatus' }
                    ]
                },
                {
                    command: IDB_CMD_NEW,
                    name: IDB_STOCK_HISTORY,
                    structureSettings: { keyPath: 'id', autoIncrement: true },
                    schemas: [
                        { name: 'itemID' },
                        { name: 'time' },
                        { name: 'stockChange' },
                        { name: 'price' },
                        { name: 'operatorID' },
                    ]
                }
            ]
        }
    ]
}