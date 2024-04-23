import React, { useEffect, useState } from 'react';
import '../../styles/account/account_global.css';
import { toast } from 'react-toastify';
import { isEmail, passwordStrength } from '../../actions/validators';
import { ACCOUNT_LOGIN_PAGE } from '../../settings/types';
import PasswordVisibilityBtn from './PasswordVisibilityBtn';
import PasswordStrength from './PasswordStrength';
import { registerAction } from '../../actions/account_actions';
import useLanguage from '../../language';

function Register({setLoginID, switchDisplayPage}) {

    const { languagePack } = useLanguage();
    const [fields, setFields] = useState({
        'username': '',
        'email': '',
        'password': '',
        'password-confirm': '',
    })
    const [showPassword, setPasswordVisibility] = useState([false, false]);
    const [passStrength, setPassStrength] = useState(0);

    useEffect(()=>{
        setPassStrength(passwordStrength(fields.password))
    }, [fields.password])

    function onInputEvt(evt) {
        evt.preventDefault();
        setFields({
            ...fields,
            [evt.target.name]: evt.target.value
        })
    }

    function validateRegister() {
        // check if all fields filled
        for(const key in fields) {
            if(!fields[key]) {
                toast.warn(`${languagePack[`ask-input-${key}`]}!`);
                return;
            }
        }
        // check if email pattern valid
        if(!fields.email || !isEmail(fields.email)) {
            toast.warn(languagePack['email-pattern-invalid']);
            return;
        }
        // check if password is valid
        if(passStrength < 3 || fields.password.length < 8 || fields.password.length > 20) {
            toast.warn(languagePack['password-invalid']);
            return;
        }
        // check if password and password-confirm the same
        if(fields.password !== fields['password-confirm']) {
            toast.warn(languagePack['password-not-match']);
            return;
        }

        registerAction(fields).then(id=>{
            if(id !== null) {
                toast.success(languagePack['Register Success!']);
                setLoginID(id);
            } else {
                toast.error(languagePack['register-failed']);
            }
        })
    }

    return (
        <form className='register account-global' onSubmit={evt=>evt.preventDefault()}>
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
            <input type={showPassword[1] ? 'input' : 'password'} name='password-confirm' 
                placeholder={languagePack['ask-input-password-confirm']} 
                onInput={onInputEvt}
            />
            <button  className='clickable' onClick={validateRegister}>{ languagePack['Register Now'] }</button>
            <span  className='function-text clickable'
                onClick={()=>switchDisplayPage(ACCOUNT_LOGIN_PAGE)}>
                    {languagePack['click-to-login']}
            </span>
        </form>
    );
}

export default Register;