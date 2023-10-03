import React, { useEffect, useState } from 'react';
import '../../styles/account/account_global.css';
import { CHANNEL_STATUS_ACTIVE, CHANNEL_STATUS_CLOSED, CHANNEL_STATUS_UNLOAD, EDIT_PASSWORD_CHANNEL, EDIT_PASS_EMAIL, EDIT_PASS_ID, IDB_ACCOUNT, REQUEST_CREDENTIAL, SESSION_EXPIRED, USER_EMAIL_VALIDATING } from '../../settings/types';
import { toast } from 'react-toastify';
import useLanguage from  '../../language';
import PasswordVisibilityBtn from './PasswordVisibilityBtn';
import PasswordStrength from './PasswordStrength';
import { isEmail, passwordStrength } from '../../actions/validators';
import { selectOneByColumn } from '../../indexedDB';
import { generateVerificationCode } from '../../actions/generator';

function EditPassword() {
    const { languagePack } = useLanguage();
    const [passwordVisibility, setPasswordVisibility] = useState([false, false])
    const [passStrength, setPasswordStrength] = useState(0);
    const [inputFields, setInputFields] = useState({
        'old-password': '', 'new-password': '',
        'confirm-new-password': '', 'user-email': '',
        'verification-code': ''
    })
    const [editPasswordChannel, setChannel] = useState({
        status: CHANNEL_STATUS_UNLOAD, channel: null
    });
    const [userCredential, setUserCredential] =  useState(null);

    useEffect(()=>{
        setChannel({
            status: CHANNEL_STATUS_ACTIVE, 
            channel: new BroadcastChannel(EDIT_PASSWORD_CHANNEL)
        });
    // eslint-disable-next-line
    }, [])

    useEffect(()=>{
        if(editPasswordChannel.channel) {
            editPasswordChannel.channel.postMessage(REQUEST_CREDENTIAL);
            editPasswordChannel.channel.onmessage = function(evt) {
                if(evt.data === SESSION_EXPIRED) {
                    toast.error(languagePack['session-expired']);
                    clear();
                } else {
                    evt.data['user-email'] && setInputFields(
                        {...inputFields, 'user-email': evt.data['user-email']}
                    )
                    setUserCredential({
                        ...evt.data, 
                        validated: evt.data.type !== EDIT_PASS_EMAIL});
                }
            }
            editPasswordChannel.channel.onmessageerror = function(err){ toast.error(err.data); }
        }
    // eslint-disable-next-line
    }, [editPasswordChannel.channel])

    function sendPasswordResult() {
        editPasswordChannel.channel && editPasswordChannel.channel.postMessage();
    }

    function clear() {
        editPasswordChannel.channel && editPasswordChannel.channel.close();
        setChannel({status: CHANNEL_STATUS_CLOSED, channel: null});
    }

    function fieldsOnInput(evt) {
        setInputFields({
            ...inputFields,
            [evt.target.name]: evt.target.value
        });
    }

    useEffect(()=>{
        setPasswordStrength(
            passwordStrength(inputFields['new-password'])
        )
    // eslint-disable-next-line
    }, [inputFields['new-password']])

    function submitExtraFields(evt) {
        evt.preventDefault();
        const fieldName = evt.target.name;

        if(fieldName === 'email') {
            if(isEmail(inputFields['user-email'])) {
                selectOneByColumn(
                    IDB_ACCOUNT, 
                    {
                        indexName: 'email', 
                        indexValue: inputFields['user-email'],
                        exclude: ['password']
                    }, result => {
                        if(!result) toast.error(languagePack['email-not-exist'])
                        else setUserCredential({
                            ...userCredential, 
                            validated: USER_EMAIL_VALIDATING,
                            'verification-code': generateVerificationCode()
                        })
                    }
                )
            } else {
                toast.warning(languagePack['email-pattern-invalid']);
            }
        } else {
            if(/^\d{4}$/g.test(inputFields['verification-code'])) {
                if(inputFields['verification-code'] === userCredential['verification-code']) {
                    setUserCredential({...userCredential, validated: true})
                } else {
                    toast.error(languagePack['verification-code-wrong'])
                }
            } else toast.error(languagePack['verification-code-invalid'])
        }
    }

    // there are too many conditions, use switch for load
    function loadPage() {
        switch(true) {
            case editPasswordChannel.status === CHANNEL_STATUS_CLOSED:
                return <span>{languagePack['channel-closed']}</span>
            case userCredential === null:
                return <span>{languagePack['waiting-for-load']}</span>
            case userCredential.validated:
            case userCredential.type === EDIT_PASS_ID:
                return (<form>
                    <PasswordVisibilityBtn visibility={passwordVisibility[0]} 
                        setVisibility={v=>{setPasswordVisibility([v, passwordVisibility[1]])}} 
                    />
                    <input type={passwordVisibility[0] ? 'text' : 'password'}
                        name='old-password' onInput={fieldsOnInput} value={inputFields['old-password']}
                        placeholder={languagePack['ask-input-old-password']} 
                    />
                    <PasswordVisibilityBtn visibility={passwordVisibility[1]} 
                        setVisibility={v=>{setPasswordVisibility([passwordVisibility[0], v])}} 
                    />
                    <input type={passwordVisibility[1] ? 'text' : 'password'}
                        name='new-password' onInput={fieldsOnInput} value={inputFields['new-password']}
                        placeholder={languagePack['ask-input-new-password']} 
                    />
                    <PasswordStrength strength={passStrength} />
                    <PasswordVisibilityBtn visibility={passwordVisibility[1]} 
                        setVisibility={v=>{setPasswordVisibility([passwordVisibility[0], v])}} 
                    />
                    <input type={passwordVisibility[1] ? 'text' : 'password'}
                        name='confirm-new-password' onInput={fieldsOnInput} value={inputFields['confirm-new-password']}
                        placeholder={languagePack['ask-input-confirm-new-password']} 
                    />
                    <button className='clickable'>{languagePack['confirm-update-password']} </button>
                </form>)
            case userCredential.validated === USER_EMAIL_VALIDATING:
                return (
                    <form onSubmit={submitExtraFields} name='verification-code'>
                        <span>{languagePack['email-sent']}</span>
                        <input type='text' name='verification-code' onInput={fieldsOnInput} 
                            value={inputFields['verification-code']}
                            placeholder={languagePack['ask-verification-code']} 
                        />
                        <button className='clickable'>{languagePack['confirm-verification-code']}</button>
                    </form>
                )
            case userCredential.type === EDIT_PASS_EMAIL:
                return (
                    <form onSubmit={submitExtraFields} name='email'>
                        <input type='text' name='user-email' onInput={fieldsOnInput}
                            placeholder={languagePack['ask-user-email']} value={inputFields['user-email']}
                        />
                        <button className='clickable'>{languagePack['confirm-email']}</button>
                    </form>
                )
            case editPasswordChannel.status === CHANNEL_STATUS_UNLOAD:
            default: return <span>{languagePack['loading-channel']}</span>
        }
    }

    return (
        <div className='edit-password account-global'>
            {loadPage()}
        </div>
    );
}

export default EditPassword;