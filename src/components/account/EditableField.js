import React from 'react';
import { updateDetailsAction } from '../../actions/account_actions';
import { toast } from 'react-toastify';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';

function EditableField({fieldName, fieldValue, setFieldValue, origValue, requireUpdate, id, title, languagePack}) {

    function inputEvt(evt) {
        setFieldValue(evt.target.value);
    }

    function submitEdit() {
        if(fieldValue !== origValue && fieldValue) {
            const updateQuery = {}
            updateQuery[fieldName] = fieldValue;
            updateDetailsAction(id, updateQuery, result=>{
                if(result) {
                    toast.success(languagePack['update-success'](fieldName))
                    requireUpdate();
                }
                else toast.error(languagePack['update-failed'](fieldName))
            })
        }
        setFieldValue(null);
    }

    function cancelEdit() {
        setFieldValue(null)
    }

    return (
        fieldValue === null ?
        <div className='detail' onClick={()=>setFieldValue(origValue)} 
            title={languagePack['Click to edit']}>
            <div className='detail-title'>{languagePack[title]}</div>
            {origValue}
        </div> :
        <>
        <CheckCircleFill className='edit-icon finish-edit' onClick={submitEdit} />
        <XCircleFill className='edit-icon cancel-edit' onClick={cancelEdit} />
        <input className='detail' placeholder={languagePack[`ask-input-${fieldName}`]} 
            name={fieldName} value={fieldValue} onInput={inputEvt}
            onKeyDown={evt=>evt.key === 'Enter' ? submitEdit() : undefined}
            autoFocus 
        />
        </>
        
    );
}

export default EditableField;