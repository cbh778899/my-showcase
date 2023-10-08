import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/account/account_global.css';
import { loginAction } from '../../actions/account_actions';
import { ACCOUNT_REGISTER_PAGE, ANSWER_CREDENTIAL, ANSWER_PAIR, CHANNEL_ONLINE, EDIT_PASSWORD_CHANNEL, EDIT_PASS_EMAIL, PASSWORD_CHANGED, REQUEST_CREDENTIAL, REQUEST_PAIR, SESSION_EXPIRED } from '../../settings/types';
import { toast } from 'react-toastify';
import PasswordVisibilityBtn from './PasswordVisibilityBtn';
import { isEmail } from '../../actions/validators';
import { generateID } from '../../actions/generator';
import useLanguage from '../../language';

function Login({setLoginID, tabID, switchDisplayPage}) {
    
    const { languagePack, currLanguage } = useLanguage();
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
        let paired = false;
        const channelID = generateID();
        const channel = new BroadcastChannel(EDIT_PASSWORD_CHANNEL);

        channel.onmessage = function(evt) {
            const msg = evt.data;
            const sendMsg = { channelID, tabID, currLanguage }

            if(!paired && msg.type === REQUEST_PAIR) {
                sendMsg.type = ANSWER_PAIR
                paired = true;
            } else if(msg.channelID === channelID) {
                if(msg.type === REQUEST_CREDENTIAL) {
                    sendMsg.type = ANSWER_CREDENTIAL;
                    sendMsg.body = {
                        from: EDIT_PASS_EMAIL,
                        'user-email': isEmail(account) ? account : ''
                    }
                } else if(msg.type === PASSWORD_CHANGED) {
                    response_received = true;
                    toast.success(languagePack['password-updated-email']);
                    channel.close();
                    return;
                }
            } else if(msg.tabID === tabID && msg.type === CHANNEL_ONLINE) {
                response_received = true;
                sendMsg.type = SESSION_EXPIRED;
            }

            channel.postMessage(sendMsg)
            sendMsg.type === SESSION_EXPIRED && channel.close();
        }
        channel.onmessageerror = function(err){ toast.error(err.data) }
        
        // wait for 5 minutes, if no response, send session expired message and close channel
        setTimeout(() => {
            if(!response_received && channel) {
                channel.postMessage({
                    channelID,
                    type: SESSION_EXPIRED
                });
                channel.close();
            }
        }, 300000);

        // send online message
        channel.postMessage({channelID, tabID, type: CHANNEL_ONLINE})
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