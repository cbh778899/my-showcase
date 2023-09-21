import { selectOneByColumn } from "../indexedDB";
import { IDB_ACCOUNT } from "../settings/types";
import { isEmail } from "./validators";

export function loginAction(account, password, callback) {
    selectOneByColumn(IDB_ACCOUNT, {
        indexName: isEmail(account) ? 'username' : 'email',
        indexValue: account,
        compareTo: { password }
    }, result => {
        if(result) callback(result.id);
        else callback(null)
    })
}