import React, { useEffect, useState } from 'react';
import '../../styles/account/login.css';
import '../../styles/account/register.css';
import { toast } from 'react-toastify';
import { isEmail, passwordStrength } from '../../actions/validators';
import toastify_settings from '../../settings/toastify_settings';
import { ACCOUNT_LOGIN_PAGE } from '../../settings/types';
import PasswordVisibilityBtn from './PasswordVisibilityBtn';
import PasswordStrength from './PasswordStrength';
import { registerAction } from '../../actions/account_actions';

function Register({setLoginID, switchDisplayPage, languagePack}) {

    const [fields, setFields] = useState({
        'username': '',
        'email': '',
        'password': '',
        'password-repeat': '',
    })
    const [showPassword, setPasswordVisibility] = useState([false, false]);
    const [passStrength, setPassStrength] = useState(0);

    useEffect(()=>{
        setPassStrength(passwordStrength(fields.password))
    }, [fields.password])

    function onInputEvt(evt) {
        evt.preventDefault();
        const update_fields = {...fields};
        Object.defineProperty(
            update_fields, evt.target.name, 
            { value: evt.target.value });
        setFields(update_fields);
    }

    function validateRegister() {
        // check if all fields filled
        for(const key in fields) {
            if(!fields[key]) {
                toast.warn(`${languagePack[`ask-input-${key}`]}!`, toastify_settings);
                return;
            }
        }
        // check if email pattern valid
        if(!fields.email || !isEmail(fields.email)) {
            toast.warn(languagePack['email-pattern-invalid'], toastify_settings);
            return;
        }
        // check if password is valid
        if(passStrength < 3 || fields.password.length < 8 || fields.password.length > 20) {
            toast.warn(languagePack['password-invalid'], toastify_settings);
            return;
        }
        // check if password and password-repeat the same
        if(fields.password !== fields['password-repeat']) {
            toast.warn(languagePack['password-repeat-not-same'], toastify_settings);
            return;
        }

        registerAction(fields, id=>{
            if(id !== null) {
                toast.success(languagePack['Register Success!'], toastify_settings);
                setLoginID(id);
            } else {
                toast.error(languagePack['register-failed'], toastify_settings);
            }
        })
    }

    return (
        <div className='register'>
            <input type='text' name='username' 
                placeholder={languagePack['ask-input-username']} 
                onInput={onInputEvt}
            />
            <input type='text' name='email' 
                placeholder={languagePack['ask-input-email']} 
                onInput={onInputEvt}
            />
            <PasswordVisibilityBtn visibility={showPassword[0]} 
                setVisibility={v => setPasswordVisibility([v, showPassword[1]])} 
            />
            <input type={showPassword[0] ? 'input' : 'password'} name='password' 
                placeholder={languagePack['ask-input-password']} 
                className='with-strength' onInput={onInputEvt}
            />
            <PasswordStrength strength={passStrength} />
            <PasswordVisibilityBtn visibility={showPassword[1]} 
                setVisibility={v => setPasswordVisibility([showPassword[0], v])} 
            />
            <input type={showPassword[1] ? 'input' : 'password'} name='password-repeat' 
                placeholder={languagePack['ask-input-password-repeat']} 
                onInput={onInputEvt}
            />
            <button onClick={validateRegister}>{ languagePack['Register Now'] }</button>
            <span onClick={()=>switchDisplayPage(ACCOUNT_LOGIN_PAGE)}>{languagePack['click-to-login']}</span>
        </div>
    );
}

export default Register;