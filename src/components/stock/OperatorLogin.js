import React, { useState } from 'react';
import PopupWindow from '../popup'
import PopupButtonSet from '../popup/PopupButtonSet'
import { OPERATOR_STATUS_INIT_PASSWORD, OPERATOR_STATUS_NORMAL, OPERATOR_SYSTEM, STOCK_ADMIN_DEFAULT_PASSWORD } from '../../settings/types';
import { toast } from 'react-toastify';
import { updateOperatorInfo, validateOperator } from '../../actions/stock_actions';
import usePopup from '../../popup';
import { setClass } from '../../utils';

function OperatorLogin({ controller, loggedInOp, setLoggedInOp, languagePack }) {

    // true if admin and false if normal operator
    const [loginType, setLoginType] = useState(false);

    const askChangePasswordController = usePopup();

    async function submitLogin(evt){ 
        evt.preventDefault();

        const password = evt.target.password.value;
        if(loginType) {
            if(password === localStorage.getItem('stock-admin-password') || STOCK_ADMIN_DEFAULT_PASSWORD) {
                toast.success(languagePack['Login Success!']);
                setLoggedInOp(OPERATOR_SYSTEM)
            } else {
                toast.error(languagePack['admin-password-incorrect']);
            }
        } else {
            const op_name = evt.target['op-name'].value;
            const operator = await validateOperator(op_name, password)
            if(operator) {
                setLoggedInOp(operator);
                evt.target['op-name'].value = '';
                toast.success(languagePack['Login Success!']);
                if(operator.status === OPERATOR_STATUS_INIT_PASSWORD) {
                    askChangePasswordController.showModal();
                }
            } else {
                toast.error(languagePack['operator-password-incorrect'])
            }
        }
        controller.close();
        evt.target.password.value = ''
    }

    async function submitChangePassword(evt) {
        evt.preventDefault();

        const target = evt.target['new-password'];
        const password = target.value;

        if(validatePassword(target)) {
            if(await updateOperatorInfo({
                id: loggedInOp.id,
                operatorName: loggedInOp.name,
                operatorPassword: password,
                operatorStatus: OPERATOR_STATUS_NORMAL
            })) {
                toast.success(languagePack['update-operator-password-success']);
                askChangePasswordController.close();
            }
            target.value = ''
        }
    }

    function validatePassword(target) {
        return setClass(
            target, 'content-invalid', 
            /^[a-zA-Z0-9,._!@#$%^&*()[\]\\/?+\-~`<>{}]{8,32}$/.test(target.value),
            true
        )
    }

    return (
        <>
        <PopupWindow controller={controller}>
            <form className='styled-popup-content' onSubmit={submitLogin}>
                { !loginType ?  
                    <div className='input-block'>
                        <div className='title'>{ languagePack['Operator Name'] }</div>
                        <input type='text' className='input-type' name='op-name'/>
                    </div> :
                    <></>
                }
                <div className='input-block'>
                    <div className='title'>{ languagePack[loginType ? 'Admin Password' : 'Operator Password'] }</div>
                    <input type='text' className='input-type' name='password'/>
                </div>
                <div onClick={()=>setLoginType(!loginType)} className='display-content switch-login-type clickable'>
                    { languagePack['switch-login-type'] }
                </div>
                <PopupButtonSet languagePack={languagePack} controller={controller} />
            </form>
        </PopupWindow>
        <PopupWindow controller={askChangePasswordController}>
            <form className='styled-popup-content' onSubmit={submitChangePassword}>
                <div className='input-block'>
                    <div className='title'>{ languagePack['ask-op-new-password'] }</div>
                    <input 
                        type='text' className='input-type' 
                        placeholder={languagePack['operator-password-rules']}
                        name='new-password' onInput={evt=>validatePassword(evt.target)} 
                    />
                </div>
                <PopupButtonSet languagePack={languagePack} only='submit' />
            </form>
        </PopupWindow>
        </>
    );
}

export default OperatorLogin;