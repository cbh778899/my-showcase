import { IDB_NAME } from "../settings/types";

const en = {
    // Home Page
    'home-page-content': [
        {
            title: 'Home Page',
            content: `
            Welcome to my homepage!</br>
            There are plenty of interesting functions implemented only using
            frontend techniques waiting to be explored.</br>
            You can find my GitHub and LinkedIn in **More** menu.</br>
            Scroll down to see more descriptions!`
        },
        {
            title: 'IndexedDB',
            content: `
            This application doesn't got a backend, so I use Web API IndexedDB for data store,
            that means all generated data is stored in your local machine.</br>
            If you want to clear all data, just go to **IndexedDB Settings** and choose **Delete Current DB**</br>
            and refresh the page, or just choose **Initialize IndexedDB Manually** to re-initialize the IndexedDB.`
        },
        {
            title: 'Account Page',
            content: `
            Go to **Functional Pages** and go to **Account Page**, where you can find a page 
            implemented with all basic account functions:</br>
            Login, Register, Change Details, Upload Avatar...</br>
            Each of those functions has different techniques, for example,
            operating database, cut and upload image, cross-tag communication and more...`
        }
    ],
    // account
    'click-to-register': 'Haven\'t got an account yet? Click here to register!',
    'click-to-login': 'Already got an account? Click here to login!',
    'ask-input-username': 'Please input your Username',
    'ask-input-email': 'Please input your Email',
    'ask-input-account': 'Please input your Username or Email',
    'ask-input-password': 'Please input your Password',
    'ask-input-password-confirm': 'Please input your Password Again',
    'email-pattern-invalid': 'This is not a valid email address!',
    'password-invalid': 'Password should be length of 8-20, with digits, letters and special characters!',
    'password-not-match': 'The two passwords you entered is not same!',
    'login-failed': 'Login Failed! Please check your username/email or password.',
    'register-failed': 'Register Failed! Your username / email might already been registered.',
    'update-success': fieldName=>{return `Update your ${fieldName} Success!`},
    'update-failed': fieldName=>{return `Update ${fieldName} failed! Your new ${fieldName} might have already been taken.`},
    'ask-select-avatar': 'Click or drag image here to upload your new avatar.',
    'file-type-invalid': 'The file you selected is not an image file! Please try another one.',
    'edit-avatar-success': 'Successfully updated your avatar!',
    'upload-avatar-failed': 'Upload avatar failed, please try initialize IDB manually',
    'confirm-delete-account': 'Are you sure you want to delete this user?',
    'account-delete-warn': 'Account has been deleted!',
    'password-updated-id': 'Successfully updated your password!',
    'password-updated-email': 'Password reset success, please try login use your new password.',
    'password-changed-logout': 'Your password has been changed, please login again!',
    'session-expired': 'Current session expired!',
    'password-updated': 'Password successfully updated!',
    'email-not-exist': 'This email seems not registered yet.',
    'verification-code-wrong': 'This verification code seems not right!',
    'verification-code-invalid': 'Verification code invalid, should be 4 digit number.',
    'ask-fill-all-fields': 'Please fill all fields!',
    'ask-different-password': 'Please input a new password different from the old one!',
    'old-password-not-match': 'Your old password does not match!',
    'channel-closed': 'Session closed. You can close this tab now.',
    'waiting-for-load': 'Waiting for everything to load....',
    'ask-input-old-password': 'Please input your old password',
    'ask-input-new-password': 'Please input your new password',
    'ask-input-confirm-new-password': 'Please input your new password again',
    'ask-user-email': 'Please input your email',
    'ask-verification-code': 'Please input your verification code',
    'verify-email-success': 'Congratulate! You verified your email.',
    'confirm-send-email': email => {return (
        `Please note, this website has no backend and all data are stored locally, `+
        `I instead using EmailJS to send verification code, and this has free limitation, `+
        `if you just want to test the function, you can click "Auto Verification" to fill the verification code. `+
        `If you are sure that the email you entered (${email}) is yours, and you want to receive an email contains `+
        `verification code, please click "Still Send Email". `+
        `This might fail due to many reasons, but it works when I'm testing.`)
    },
    'wait-email-sending': 'Email sending, please wait until we send it...',
    'email-sent': 'We\'ve sent an email contains your verification code, please check your inbox or junk mail for the code.',
    'email-unsent': 'We\'ve tried send email but somewhat failed, please use "Auto Verification" instead.',
    'confirm-update-password': 'Update Now',
    'confirm-verification-code': 'Submit Verification Code',
    'confirm-email': 'Confirm Email',
    'loading-channel': 'Waiting for session to load...',
    'forgot-password': 'Forgot your password? Click here to reset.',
    // notification: db
    'init-idb-success': 'Manually Initialize IDB Success!',
    'del-idb-success': `Delete DB ${IDB_NAME} success!`,
    'del-idb-fail': `Delete DB ${IDB_NAME} Failed!`,
    'open-idb-timeout': 'Open DB timeout (500ms), please consider try init IDB manually.',
    'clear-table-success': tb_name=>{return `Clear IDB Schema ${tb_name} Success!`},
    'clear-table-fail': tb_name=>{return `Clear IDB Schema ${tb_name} Failed!`},
    // Declaimer & global
    'homepage-title': 'Lililele\'s Homepage',
    'contact-me': <>Please contact me at <a href="mailto:cbh778899@outlook.com">cbh778899@outlook.com</a> if needed.</>,
}

export default en;