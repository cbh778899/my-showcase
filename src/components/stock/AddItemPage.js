import React from 'react';
import PopupWindow from '../popup';
import { addItem } from '../../actions/stock_actions';
import { toast } from 'react-toastify';
import { multiCondResult } from '../../utils';
import { OPERATOR_SYSTEM } from '../../settings/types';

function AddItemPage({controller, operator, reqUpdateStock, languagePack}) {

    async function submitNewItem(evt) {
        evt.preventDefault();
        
        if(!operator || operator.id === OPERATOR_SYSTEM.id) {
            toast.error(languagePack['operator-not-valid'])
            return;
        }

        const item_name = evt.target['item-name'].value;
        const unit_price = +evt.target['unit-price'].value;
        const item_stock = +evt.target['item-stock'].value;
        
        if(!await multiCondResult([
            { condition: !!item_name, isFalse: () => { toast.error(languagePack['item-name-invalid']) } },
            { condition: !isNaN(unit_price), isFalse: () => { toast.error(languagePack['unit-price-invalid']) } },
            { condition: !isNaN(item_stock), isFalse: () => { toast.error(languagePack['item-stock-invalid']) } },
        ])) return;

        if(await addItem(item_name, unit_price, item_stock, operator.id)) {
            reqUpdateStock();
            toast.success(languagePack['add-item-success'])
        } else {
            toast.error(languagePack['add-item-failed']);
        }
    }

    return (
        <PopupWindow controller={controller}>
            <form className='styled-popup-content' onSubmit={submitNewItem}>
                <div className='input-block'>
                    <div className='title'>{ languagePack['Item Name'] }</div>
                    <input className='input-type' type='text' name='item-name'/>
                </div>
                <div className='input-block'>
                    <div className='title'>{ languagePack['Unit Price'] }</div>
                    <input className='input-type' type='text' name='unit-price'/>
                </div>
                <div className='input-block'>
                    <div className='title'>{ languagePack['Item Stock'] }</div>
                    <input className='input-type' type='text' name='item-stock'/>
                </div>
                <button className='popup-btn blue-btn clickable' type='submit'>
                    { languagePack['Submit'] }
                </button>
                <div className='popup-btn clickable' onClick={controller.close}>
                    { languagePack['Cancel'] }
                </div>
            </form>
        </PopupWindow>
    );
}

export default AddItemPage;