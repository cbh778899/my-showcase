import React, { useEffect, useState } from 'react';
import '../../styles/account/account_global.css';
import '../../styles/account/edit_password.css';
import { 
    ANSWER_CREDENTIAL, ANSWER_PAIR, CHANNEL_STATUS_ACTIVE, 
    CHANNEL_STATUS_CLOSED, CHANNEL_STATUS_UNLOAD, EDIT_PASSWORD_CHANNEL, 
    EDIT_PASS_EMAIL, EDIT_PASS_ID, IDB_ACCOUNT, PASSWORD_CHANGED, 
    REQUEST_CREDENTIAL, REQUEST_PAIR, SESSION_EXPIRED, 
    USER_EMAIL_VALIDATED, USER_EMAIL_VALIDATING 
} from '../../settings/types';
import { toast } from 'react-toastify';
import useLanguage from  '../../language';
import PasswordVisibilityBtn from './PasswordVisibilityBtn';
import PasswordStrength from './PasswordStrength';
import { isEmail, passwordStrength } from '../../actions/validators';
import { getByID, getOne, update } from '../../indexedDB';
import { generateVerificationCode } from '../../actions/generator';
import { sendVerificationCode } from '../../actions/account_actions';

function EditPassword() {
    const { languagePack, setLanguage } = useLanguage();
    const [passwordVisibility, setPasswordVisibility] = useState({
        'old-password': false, 'new-password': false, 'confirm-new-password': false
    })
    const [passStrength, setPasswordStrength] = useState(0);
    const [inputFields, setInputFields] = useState({
        'old-password': '', 'new-password': '',
        'confirm-new-password': '', 'user-email': '',
        'verification-code': ''
    })
    const [editPasswordChannel, setChannel] = useState({
        status: CHANNEL_STATUS_UNLOAD, channel: null, channelID: null
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
            let channelID = editPasswordChannel.channelID || null;

            editPasswordChannel.channel.postMessage({type: REQUEST_PAIR});
            editPasswordChannel.channel.onmessage = function(evt) {
                const msg = evt.data;

                if(msg.channelID === channelID) {
                    switch(msg.type) {
                        case ANSWER_CREDENTIAL: (
                            function() {
                                const msgBody = msg.body
                                if(msgBody.from === EDIT_PASS_EMAIL && msgBody['user-email']) {
                                    setInputFields({
                                        ...inputFields, 
                                        'user-email': msgBody['user-email']
                                    })
                                }
                                setUserCredential(msgBody)
                            })()
                            break;
                        case SESSION_EXPIRED:
                            toast.error(languagePack['session-expired']);
                            clear();
                            break;
                        default: break;
                    }
                } else {
                    if(!channelID && msg.type === ANSWER_PAIR) {
                        channelID = msg.channelID
                        setLanguage(msg.currLanguage);
                        setChannel({...editPasswordChannel, channelID})
                        editPasswordChannel.channel.postMessage({
                            channelID, type: REQUEST_CREDENTIAL
                        })
                    }
                }
            }
            editPasswordChannel.channel.onmessageerror = function(err){ toast.error(err.data); }
        }
    // eslint-disable-next-line
    }, [editPasswordChannel.channel])

    function sendPasswordResult() {
        toast.success(languagePack['password-updated'])
        editPasswordChannel.channel && editPasswordChannel.channel.postMessage({
            channelID: editPasswordChannel.channelID,
            type: PASSWORD_CHANGED
        });
        clear();
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

    async function submitExtraFields(evt) {
        evt.preventDefault();
        const fieldName = evt.target.name;

        if(fieldName === 'email') {
            if(isEmail(inputFields['user-email'])) {
                const account_details = await getOne(IDB_ACCOUNT, { email: inputFields['user-email'] }, ['password']);
                if(account_details) {
                    const { id, email, username } = account_details;
                    const verification_code = generateVerificationCode()
                    setUserCredential({
                        ...userCredential,
                        id, username, 'user-email': email,
                        'email-validation': USER_EMAIL_VALIDATING,
                        'verification-code': verification_code
                    })
                } else {
                    toast.error(languagePack['email-not-exist'])
                }
            } else {
                toast.warning(languagePack['email-pattern-invalid']);
            }
        } else {
            if(/^\d{4}$/g.test(inputFields['verification-code'])) {
                if(inputFields['verification-code'] === userCredential['verification-code']) {
                    toast.success(languagePack['verify-email-success'])
                    setUserCredential({...userCredential, 'email-validation': USER_EMAIL_VALIDATED})
                } else {
                    toast.error(languagePack['verification-code-wrong'])
                }
            } else toast.error(languagePack['verification-code-invalid'])
        }
    }

    function autoFillVerificationCode() {
        if(userCredential['verification-code']) {
            setInputFields({...inputFields, 'verification-code': userCredential['verification-code']})
        }
    }

    async function sendVerificationByEmail() {
        if(userCredential['verification-code']) {
            toast.info(languagePack['wait-email-sending'])
            const result = await sendVerificationCode(
                userCredential['user-email'], 
                userCredential.username, 
                userCredential['verification-code']
            )
            result ? toast.success(languagePack['email-sent']) : toast.error(languagePack['email-unsent'])
        }
    }

    function submitPasswordEdit(evt) {
        evt.preventDefault()

        if(
            (!inputFields['old-password'] && userCredential['email-validation'] !== USER_EMAIL_VALIDATED) 
            || !inputFields['new-password'] || !inputFields['confirm-new-password']
        ){
            toast.error(languagePack['ask-fill-all-fields']);
        } else if(inputFields['new-password'] === inputFields['old-password']) {
            toast.error(languagePack['ask-different-password'])
        } else if(inputFields['new-password'] !== inputFields['confirm-new-password']) {
            toast.error(languagePack['password-not-match'])
        } else {
            getByID(
                IDB_ACCOUNT, userCredential.id,
                userCredential['email-validation'] !== USER_EMAIL_VALIDATED ? 
                    { password: inputFields['old-password'] } : null,
                ['password']
            ).then(result=>{
                if(result) {
                    update(
                        IDB_ACCOUNT, 
                        { id: userCredential.id },
                        { password: inputFields['new-password'] }
                    ).then(success => { success && sendPasswordResult() })
                } else toast.error(languagePack['old-password-not-match'])
            })
        }
    }

    // there are too many conditions, use switch for load
    function loadPage() {
        switch(true) {
            case editPasswordChannel.status === CHANNEL_STATUS_CLOSED:
                return <span className='info-span'>{languagePack['channel-closed']}</span>
            case userCredential === null:
                return <span className='info-span'>{languagePack['waiting-for-load']}</span>
            case userCredential['email-validation'] === USER_EMAIL_VALIDATED:
            case userCredential.from === EDIT_PASS_ID:
                return (<form onSubmit={submitPasswordEdit}>
                    {
                        userCredential['email-validation'] === USER_EMAIL_VALIDATED ? 
                        <></>:
                        <><PasswordVisibilityBtn visibility={passwordVisibility['old-password']} 
                            setVisibility={v=>{setPasswordVisibility({...passwordVisibility, 'old-password': v})}} 
                        />
                        <input type={passwordVisibility['old-password'] ? 'text' : 'password'}
                            name='old-password' onInput={fieldsOnInput} value={inputFields['old-password']}
                            placeholder={languagePack['ask-input-old-password']} 
                        /></>
                    }
                    <PasswordVisibilityBtn visibility={passwordVisibility['new-password']} 
                        setVisibility={v=>{setPasswordVisibility({...passwordVisibility, 'new-password': v})}} 
                    />
                    <input type={passwordVisibility['new-password'] ? 'text' : 'password'}
                        name='new-password' onInput={fieldsOnInput} value={inputFields['new-password']}
                        placeholder={languagePack['ask-input-new-password']} 
                    />
                    <PasswordStrength strength={passStrength} />
                    <PasswordVisibilityBtn visibility={passwordVisibility['confirm-new-password']} 
                        setVisibility={v=>{setPasswordVisibility({...passwordVisibility, 'confirm-new-password': v})}} 
                    />
                    <input type={passwordVisibility['confirm-new-password'] ? 'text' : 'password'}
                        name='confirm-new-password' onInput={fieldsOnInput} value={inputFields['confirm-new-password']}
                        placeholder={languagePack['ask-input-confirm-new-password']} 
                    />
                    <button className='clickable'>{languagePack['confirm-update-password']} </button>
                </form>)
            case userCredential['email-validation'] === USER_EMAIL_VALIDATING:
                return (
                    <form onSubmit={submitExtraFields} name='verification-code'>
                        <span className='info-span'>{languagePack['confirm-send-email'](userCredential['user-email'])}</span>
                        <button type='button' className='clickable' onClick={autoFillVerificationCode}>
                            {languagePack['Auto Verification']}
                        </button>
                        <button type='button' className='clickable' onClick={sendVerificationByEmail}>
                            {languagePack['Still Send Email']}
                        </button>
                        <input type='text' name='verification-code' onInput={fieldsOnInput} 
                            value={inputFields['verification-code']}
                            placeholder={languagePack['ask-verification-code']} 
                        />
                        <button type='submit' className='clickable'>{languagePack['confirm-verification-code']}</button>
                    </form>
                )
            case userCredential.from === EDIT_PASS_EMAIL:
                return (
                    <form onSubmit={submitExtraFields} name='email'>
                        <input type='text' name='user-email' onInput={fieldsOnInput}
                            placeholder={languagePack['ask-user-email']} value={inputFields['user-email']}
                        />
                        <button className='clickable'>{languagePack['confirm-email']}</button>
                    </form>
                )
            case editPasswordChannel.status === CHANNEL_STATUS_UNLOAD:
            default: return <span className='info-span'>{languagePack['loading-channel']}</span>
        }
    }

    return (
        <div className='edit-password account-global'>
            {loadPage()}
        </div>
    );
}

export default EditPassword;