import React, { useState } from 'react';
import PopupWindow from '../popup';
import { addItem } from '../../actions/stock_actions';
import { toast } from 'react-toastify';
import { multiCondResult } from '../../utils';

function AddItemPage({controller, operators, reqUpdateStock, languagePack}) {

    const [defaultOperator, setDefaultOperator] = useState(
        localStorage.getItem('selected-operator-id') || '*'
    )

    async function submitNewItem(evt) {
        evt.preventDefault();

        const item_name = evt.target['item-name'].value;
        const unit_price = +evt.target['unit-price'].value;
        const item_stock = +evt.target['item-stock'].value;
        const operator_id = evt.target['selected-operator'].value;
        
        if(!await multiCondResult([
            { condition: !!item_name, isFalse: () => { toast.error(languagePack['item-name-invalid']) } },
            { condition: !isNaN(unit_price), isFalse: () => { toast.error(languagePack['unit-price-invalid']) } },
            { condition: !isNaN(item_stock), isFalse: () => { toast.error(languagePack['item-stock-invalid']) } },
        ])) return;

        if(await addItem(item_name, unit_price, item_stock, operator_id)) {
            reqUpdateStock();
            toast.success(languagePack['add-item-success'])
        } else {
            toast.error(languagePack['add-item-failed']);
        }
    }

    function selectOperator(evt) {
        const selected_op_id = evt.target.value;
        
        localStorage.setItem('selected-operator-id', selected_op_id);
        setDefaultOperator(selected_op_id);
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
                <div className='input-block'>
                    <div className='title'>{ languagePack['Operator'] }</div>
                    <select className='input-type' name='selected-operator' value={defaultOperator} onChange={selectOperator}>
                        {
                            operators.map(op => {
                                return <option key={`operator-id-${op.id}`} value={`${op.id}`}>{ op.name }</option>
                            })
                        }
                    </select>
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