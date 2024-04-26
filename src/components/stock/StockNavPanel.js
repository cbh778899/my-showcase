import React, { useState } from 'react';
import PopupWindow from '../popup'
import usePopup from '../../popup'
import '../../styles/stock/stock_nav_panel.css';
import ManageOperatorPage from './ManageOperatorPage';
import { STOCK_ADMIN_DEFAULT_PASSWORD } from '../../settings/types';
import { toast } from 'react-toastify';

function StockNavPanel({languagePack, operators, reqUpdateOperators}) {

    const manageOperatorController = usePopup(true);
    const saleController = usePopup(true);
    const askPasswordController = usePopup(true);

    const [adminValidated, setAdminValidated] = useState(false)

    function submitAdminPassword(evt) {
        evt.preventDefault();
        const password = evt.target['admin-password'].value;
        const validatePassword = localStorage.getItem('stock-admin-password') || STOCK_ADMIN_DEFAULT_PASSWORD;
        if(password === validatePassword) {
            setAdminValidated(true);
            askPasswordController.close();
            manageOperatorController.showModal()
            toast.success(languagePack['admin-password-validated']);
        } else {
            toast.error(languagePack['admin-password-incorrect']);
        }
    }

    return (
        <div className='stock-nav-panel'>
            <div 
                className='menu-item clickable' 
                onClick={ adminValidated ? 
                    manageOperatorController.showModal :
                    askPasswordController.showModal
                }
            >{ languagePack['Manage Operators'] }</div>
            <div 
                className='menu-item clickable' 
                onClick={saleController.showModal}
            >{ languagePack['Sale'] }</div>

            <ManageOperatorPage 
                controller={manageOperatorController} 
                reqUpdateOperators={reqUpdateOperators} 
                languagePack={languagePack} operators={operators}
            />
            <PopupWindow controller={saleController}>
                sale controller
            </PopupWindow>

            <PopupWindow controller={askPasswordController}>
                <form className='styled-popup-content' onSubmit={submitAdminPassword}>
                    <div className='display-content'>
                        { languagePack['ask-admin-password'] }
                    </div>
                    <input name='admin-password' type='text' className='input-type' />
                    <input type='submit' className='popup-btn blue-btn clickable' value={languagePack['Submit']} />
                    <div className='popup-btn clickable' onClick={askPasswordController.close}>
                        { languagePack['Cancel'] }
                    </div>
                </form>
            </PopupWindow>
        </div>
    );
}

export default StockNavPanel;