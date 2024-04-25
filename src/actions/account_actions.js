import { deleteByID, insert, getOne, update } from "../indexedDB";
import { IDB_ACCOUNT } from "../settings/types";
import { isEmail } from "../utils";
import emailjs from '@emailjs/browser';

export async function loginAction(account, password) {
    const validated = await getOne(IDB_ACCOUNT, { [isEmail(account) ? 'email' : 'username']: account, password })
    return (validated ? validated.id : null)
}

export async function registerAction(userDetails) {
    const { username, email, password } = userDetails;
    const user_id = await insert(IDB_ACCOUNT, { username, email, password })
    return user_id
}

export async function updateDetailsAction(update_query) {
    return await update(IDB_ACCOUNT, update_query);
}

export async function deleteUser(id) {
    return await deleteByID(IDB_ACCOUNT, id);
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