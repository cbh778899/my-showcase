import React, { useState } from 'react';
import '../../styles/account/login.css';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { loginAction } from '../../actions/account_actions';
import { ACCOUNT_REGISTER_PAGE } from '../../settings/types';
import { toast } from 'react-toastify';
import toastify_settings from '../../settings/toastify_settings';

function Login({setLoginID, switchDisplayPage, languagePack}) {
    
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setPasswordVisibility] = useState(false);

    function validateLogin() {
        if(!account) {
            toast.info(languagePack['ask-input-account'], toastify_settings);
        } else if(!password) {
            toast.info(languagePack['ask-input-password'], toastify_settings);
        } else {
            loginAction(account, password, id=> {
                if(id === null) {
                    toast.error(languagePack['login-failed'], toastify_settings);
                } else {
                    toast.success(languagePack['Login Success!'], toastify_settings);
                    setLoginID(id);
                }
            })
        }
    }

    return (
        <div className='login'>
            <input type='text' name='account' onInput={e=>setAccount(e.target.value)}
                placeholder={languagePack['ask-input-account']} 
            />
            <input type={ showPassword ? 'text' : 'password' } onInput={e=>{setPassword(e.target.value)}} 
                placeholder={languagePack['ask-input-password']} 
            />
            {
                showPassword ? 
                <EyeSlash className='change-visibility-icon' onClick={()=>setPasswordVisibility(false)} /> :
                <Eye className='change-visibility-icon' onClick={()=>setPasswordVisibility(true)} />
            }
            <button onClick={validateLogin}>
                {languagePack['Login']}
            </button>
            <span onClick={()=>switchDisplayPage(ACCOUNT_REGISTER_PAGE)}>
                {languagePack['click-to-register']}
            </span>
        </div>
    );
}

export default Login;