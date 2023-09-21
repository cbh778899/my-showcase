import { IDB_NAME } from "../settings/types";

const en = {
    // account
    'click-to-register': 'Haven\'t got an account yet? Click here to register!',
    'click-to-login': 'Already got an account? Click here to login!',
    'ask-input-account': 'Please input your Username or Email',
    'ask-input-password': 'Please input your Password',
    'login-failed': 'Login Failed! Please check your Username/Email or Password.',
    // notification: db
    'init-idb-success': 'Manually Initialize IDB Success!',
    'del-idb-success': `Delete DB ${IDB_NAME} success!`,
    'del-idb-fail': `Delete DB ${IDB_NAME} Failed!`,
    'open-idb-timeout': 'Open DB timeout (500ms), please consider try init IDB manually.',
    'clear-table-success': tb_name=>{return `Clear IDB Schema ${tb_name} Success!`},
    'clear-table-fail': tb_name=>{return `Clear IDB Schema ${tb_name} Failed!`},
    // Declaimer & global
    'contact-me': <>Please contact me at <a href="mailto:cbh778899@outlook.com">cbh778899@outlook.com</a> if needed.</>,
}

export default en;