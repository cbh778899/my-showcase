import { insert, selectOneByColumn } from "../indexedDB";
import { IDB_ACCOUNT } from "../settings/types";
import { isEmail } from "./validators";

export function loginAction(account, password, callback) {
    selectOneByColumn(IDB_ACCOUNT, {
        indexName: isEmail(account) ? 'email' : 'username',
        indexValue: account,
        compareTo: { password }
    }, result => {
        if(result) callback(result.id);
        else callback(null)
    })
}

export function registerAction(userDetails, callback) {
    const { username, email, password } = userDetails;
    insert(IDB_ACCOUNT, {
        username, email, password
    }, success => {
        if(success){
            selectOneByColumn(IDB_ACCOUNT, {
                indexName: 'username',
                indexValue: username
            }, result => {
                if(result) callback(result.id)
                else callback(null)
            })
        } else callback(null)
    })
}