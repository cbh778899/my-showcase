import { insert, selectOneByColumn, update } from "../indexedDB";
import { IDB_ACCOUNT } from "../settings/types";
import { isEmail } from "./validators";
import emailjs from '@emailjs/browser';

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

export function updateDetailsAction(id, updateQuery, callback) {
    update(IDB_ACCOUNT, {
        id, updateQuery
    }, result=>callback(result))
}

export async function sendVerificationCode(email, username, code) {
    const service_id = process.env.REACT_APP_EMAIL_JS_SERVICE_ID
    const template_id = process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID
    const user_id = process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY
    try {
        await emailjs.send(
            service_id,template_id,
            {
                to_name: username, to_email: email, code
            },
            user_id
        )
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
}