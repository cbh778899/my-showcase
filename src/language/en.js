import { IDB_NAME } from "../settings/types";

const en = {
    // account
    'click-to-register': 'Haven\'t got an account yet? Click here to register!',
    'click-to-login': 'Already got an account? Click here to login!',
    'ask-input-username': 'Please input your Username',
    'ask-input-email': 'Please input your Email',
    'ask-input-account': 'Please input your Username or Email',
    'ask-input-password': 'Please input your Password',
    'ask-input-password-repeat': 'Please input your Password Again',
    'email-pattern-invalid': 'This is not a valid email address!',
    'password-invalid': 'Password should be length of 8-20, with digits, letters and special characters!',
    'password-repeat-not-same': 'The two passwords you entered is not same!',
    'login-failed': 'Login Failed! Please check your username/email or password.',
    'register-failed': 'Register Failed! Your username / email might already been registered.',
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