import React, { useState } from 'react';
import '../../styles/account/login.css';
import { loginAction } from '../../actions/account_actions';
import { ACCOUNT_REGISTER_PAGE } from '../../settings/types';
import { toast } from 'react-toastify';
import PasswordVisibilityBtn from './PasswordVisibilityBtn';

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

    return (
        <form className='login' onSubmit={evt=>evt.preventDefault()}>
            <input type='text' name='account' onInput={e=>setAccount(e.target.value)}
                placeholder={languagePack['ask-input-account']} 
            />
            <PasswordVisibilityBtn visibility={showPassword} setVisibility={setPasswordVisibility} />
            <input type={ showPassword ? 'text' : 'password' } onInput={e=>{setPassword(e.target.value)}} 
                placeholder={languagePack['ask-input-password']} 
            />
            <button onClick={validateLogin}>
                {languagePack['Login']}
            </button>
            <span onClick={()=>switchDisplayPage(ACCOUNT_REGISTER_PAGE)}>
                {languagePack['click-to-register']}
            </span>
        </form>
    );
}

export default Login;