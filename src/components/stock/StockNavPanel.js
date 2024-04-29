import React, { useState } from 'react';
import PopupWindow from '../popup'
import usePopup from '../../popup'
import '../../styles/stock/stock_nav_panel.css';
import ManageOperatorPage from './ManageOperatorPage';
import {  OPERATOR_SYSTEM } from '../../settings/types';
import OperatorLogin from './OperatorLogin';

function StockNavPanel({languagePack, operators, reqUpdateOperators}) {

    const operatorLoginController = usePopup(true);
    const manageOperatorController = usePopup(true);
    const saleController = usePopup(true);

    const [loggedInOperator, setLoggedInOp] = useState(null)

    function logoutOp() {
        setLoggedInOp(null);
    }

    return (
        <div className='stock-nav-panel'>
            {
                !loggedInOperator ?
                <div 
                    className='menu-item clickable' 
                    onClick={ operatorLoginController.showModal }
                >{ languagePack['Operator Login'] }</div> : <></>
            }
            {
                loggedInOperator && loggedInOperator.id === OPERATOR_SYSTEM.id ?
                <div 
                    className='menu-item clickable' 
                    onClick={ manageOperatorController.showModal}
                >{ languagePack['Manage Operators'] }</div> : <></>
            }
            {
                loggedInOperator && loggedInOperator.id !== OPERATOR_SYSTEM.id ?
                <div 
                    className='menu-item clickable' 
                    onClick={saleController.showModal}
                >{ languagePack['Sale'] }</div> : <></>
            }
            {
                loggedInOperator ?
                <div 
                    className='menu-item clickable' 
                    onClick={logoutOp}
                >{ languagePack['Logout Current Operator'] }</div> : <></>
            }
            <OperatorLogin 
                controller={operatorLoginController}
                loggedInOp={loggedInOperator}
                setLoggedInOp={setLoggedInOp}
                languagePack={languagePack}
            />
            <ManageOperatorPage 
                controller={manageOperatorController} 
                reqUpdateOperators={reqUpdateOperators} 
                languagePack={languagePack} operators={operators}
            />
            <PopupWindow controller={saleController}>
                sale controller
            </PopupWindow>
        </div>
    );
}

export default StockNavPanel;