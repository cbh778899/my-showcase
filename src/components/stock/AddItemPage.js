import React from 'react';
import PopupWindow from '../popup';
import { addItem } from '../../actions/stock_actions';
import { toast } from 'react-toastify';
import { multiCondResult, setClass } from '../../utils';
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
            { condition: validateInput(evt.target['item-name']), isFalse: () => { toast.error(languagePack['item-name-invalid']) } },
            { condition: validateInput(evt.target['unit-price']), isFalse: () => { toast.error(languagePack['unit-price-invalid']) } },
            { condition: validateInput(evt.target['item-stock']), isFalse: () => { toast.error(languagePack['item-stock-invalid']) } },
        ])) return;

        if(await addItem(item_name, unit_price, item_stock, operator.id)) {
            reqUpdateStock();
            toast.success(languagePack['add-item-success'])
            // reset input fields
            evt.target['item-name'].value = ''
            evt.target['unit-price'].value = ''
            evt.target['item-stock'].value = ''
        } else {
            toast.error(languagePack['add-item-failed']);
        }
    }

    function validateInput(target) {
        const name = target.name;
        const input = target.value;

        return setClass(target, 'content-invalid', 
            name === 'item-name' ? !!input :
            name === 'unit-price' || name === 'item-stock' ? !isNaN(+input) : true,
            true
        )
    }

    return (
        <PopupWindow controller={controller}>
            <form className='styled-popup-content' onSubmit={submitNewItem}>
                <div className='input-block'>
                    <div className='title'>{ languagePack['Item Name'] }</div>
                    <input className='input-type' type='text' name='item-name' onInput={evt=>validateInput(evt.target)}/>
                </div>
                <div className='input-block'>
                    <div className='title'>{ languagePack['Unit Price'] }</div>
                    <input className='input-type' type='text' name='unit-price' onInput={evt=>validateInput(evt.target)}/>
                </div>
                <div className='input-block'>
                    <div className='title'>{ languagePack['Item Stock'] }</div>
                    <input className='input-type' type='text' name='item-stock' onInput={evt=>validateInput(evt.target)}/>
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