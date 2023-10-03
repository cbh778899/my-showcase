import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/account/account_global.css';
import { loginAction } from '../../actions/account_actions';
import { ACCOUNT_REGISTER_PAGE, EDIT_PASSWORD_CHANNEL, EDIT_PASS_EMAIL, REQUEST_CREDENTIAL, SESSION_EXPIRED } from '../../settings/types';
import { toast } from 'react-toastify';
import PasswordVisibilityBtn from './PasswordVisibilityBtn';
import { isEmail } from '../../actions/validators';

function Login({setLoginID, switchDisplayPage, languagePack}) {
    
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setPasswordVisibility] = useState(false);

    function validateLogin() {
        if(!account) {
            toast.warn(`${languagePack['ask-input-account']}!`);
        } else if(!password) {
            toast.warn(`${languagePack['ask-input-password']}!`);
        } else {
            loginAction(account, password, id=> {
                if(id === null) {
                    toast.error(languagePack['login-failed']);
                } else {
                    toast.success(languagePack['Login Success!']);
                    setLoginID(id);
                }
            })
        }
    }

    function forgotPassword() {
        // wait 500ms for edit password to load
        let response_received = false;
        const channel = new BroadcastChannel(EDIT_PASSWORD_CHANNEL);
        channel.onmessage = function(evt) {
            if(evt.data === REQUEST_CREDENTIAL) {
                channel.postMessage({
                    type: EDIT_PASS_EMAIL, 
                    'user-email': isEmail(account) ? account : null
                })
            } else {
                response_received = true;
            }
        }
        channel.onmessageerror = function(err){ toast.error(err.data) }
        
        // wait for 5 minutes, if no response, send session expired message and close channel
        setTimeout(() => {
            if(!response_received && channel) {
                channel.postMessage(SESSION_EXPIRED);
                channel.close();
            }
        }, 300000);
    }

    return (
        <form className='login account-global' onSubmit={evt=>evt.preventDefault()}>
            <input type='text' name='account' onInput={e=>setAccount(e.target.value)}
                placeholder={languagePack['ask-input-account']} 
            />
            <PasswordVisibilityBtn visibility={showPassword} setVisibility={setPasswordVisibility} />
            <input type={ showPassword ? 'text' : 'password' } onInput={e=>{setPassword(e.target.value)}} 
                placeholder={languagePack['ask-input-password']} 
            />
            <button className='clickable' onClick={validateLogin}>
                {languagePack['Login']}
            </button>
            <Link to='edit-password' target='_blank'
                className='function-text clickable'
                onClick={forgotPassword}
            >
                {languagePack['forgot-password']}
            </Link>
            <span className='function-text clickable'
                onClick={()=>switchDisplayPage(ACCOUNT_REGISTER_PAGE)}>
                {languagePack['click-to-register']}
            </span>
        </form>
    );
}

export default Login;