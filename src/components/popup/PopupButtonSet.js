import React from 'react';

function ButtonSet({ 
    controller, languagePack, onSubmit = null, onCancel = null, 
    only = null, submitText = null, cancelText = null 
}) {
    return (
        <>
        {
            only && only === 'cancel' ? <></> :
            onSubmit ? 
            <div className='popup-btn blue-btn clickable' onClick={onSubmit}>{ submitText || languagePack['Submit'] }</div> :
            <button className='popup-btn blue-btn clickable' type='submit'>{ submitText || languagePack['Submit'] }</button>
        }
        {
            only && only === 'submit' ? <></> :
            <div className='popup-btn clickable' onClick={onCancel || controller.close}>
                { cancelText || languagePack['Cancel'] }
            </div>
        }
        </>
    );
}

export default ButtonSet;