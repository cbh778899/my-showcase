import React from 'react';
import { updateDetailsAction } from '../../actions/account_actions';
import { toast } from 'react-toastify';

function EditableField({fieldName, fieldValue, setFieldValue, origValue, requireUpdate, id, title, languagePack}) {

    function inputEvt(evt) {
        setFieldValue(evt.target.value);
    }

    function submitEdit(isCancel=false) {
        if(!isCancel && fieldValue !== origValue && fieldValue) {
            const updateQuery = {}
            updateQuery[fieldName] = fieldValue;
            updateDetailsAction(id, updateQuery, result=>{
                if(result) requireUpdate();
                else toast.error(languagePack['update-failed'](fieldName))
            })
        }
        setFieldValue(null);
    }

    return (
        fieldValue === null ?
        <div className='detail' onClick={()=>setFieldValue(origValue)}>
            <div className='detail-title'>{languagePack[title]}</div>
            {origValue}
        </div> :
        <input className='detail' placeholder={languagePack[`ask-input-${fieldName}`]} 
            name={fieldName} value={fieldValue} onInput={inputEvt}
            onKeyDown={evt=>evt.key === 'Enter' ? submitEdit() : undefined}
        />
    );
}

export default EditableField;