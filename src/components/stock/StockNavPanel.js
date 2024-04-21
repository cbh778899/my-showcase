import React from 'react';
import PopupWindow from '../popup'
import usePopup from '../../popup'
import '../../styles/stock/stock_nav_panel.css';
import ManageOperatorPage from './ManageOperatorPage';

function StockNavPanel({languagePack}) {

    const manageOperatorController = usePopup(true);
    const saleController = usePopup(true);

    return (
        <div className='stock-nav-panel'>
            <div 
                className='menu-item clickable' 
                onClick={manageOperatorController.showModal}
            >{ languagePack['Manage Operators'] }</div>
            <div 
                className='menu-item clickable' 
                onClick={saleController.showModal}
            >{ languagePack['Sale'] }</div>

            <ManageOperatorPage controller={manageOperatorController} languagePack={languagePack} />
            <PopupWindow controller={saleController}>
                sale controller
            </PopupWindow>
        </div>
    );
}

export default StockNavPanel;