import React, { useState } from 'react';
import PopupWindow from '../popup'
import usePopup from '../../popup'
import '../../styles/stock/stock_nav_panel.css';
import ManageOperatorPage from './ManageOperatorPage';
import {  OPERATOR_SYSTEM } from '../../settings/types';
import OperatorLogin from './OperatorLogin';
import AddItemPage from './AddItemPage'

function StockNavPanel({languagePack, operators, reqUpdateOperators, reqUpdateStock}) {

    const operatorLoginController = usePopup(true);
    const manageOperatorController = usePopup(true);
    const addItemController = usePopup(true);
    const saleController = usePopup(true);

    const [loggedInOperator, setLoggedInOp] = useState(null)

    function logoutOp() {
        setLoggedInOp(null);
    }

    return (
        <div className='stock-nav-panel'>
            {
                // when not logged in
                !loggedInOperator ?
                <div 
                    className='menu-item clickable' 
                    onClick={ operatorLoginController.showModal }
                >{ languagePack['Operator Login'] }</div> : <></>
            }
            {
                // when is system operator
                loggedInOperator && loggedInOperator.id === OPERATOR_SYSTEM.id ?
                <div 
                    className='menu-item clickable' 
                    onClick={ manageOperatorController.showModal}
                >{ languagePack['Manage Operators'] }</div> : <></>
            }
            {
                // when is normal operator
                loggedInOperator && loggedInOperator.id !== OPERATOR_SYSTEM.id ?
                <>
                <div 
                    className='menu-item clickable' 
                    onClick={addItemController.showModal}
                >{ languagePack['Add Item'] }</div>
                <div 
                    className='menu-item clickable' 
                    onClick={saleController.showModal}
                >{ languagePack['Sale'] }</div>
                </>
                : <></>
            }
            {
                // when anyone logged in
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
            <AddItemPage 
                controller={addItemController}
                languagePack={languagePack}
                reqUpdateStock={reqUpdateStock} operator={loggedInOperator}
            />
            <PopupWindow controller={saleController}>
                sale controller
            </PopupWindow>
        </div>
    );
}

export default StockNavPanel;