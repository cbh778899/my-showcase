import React from 'react';
import '../../styles/popup/popup_window.css';

function PopupWindow({ controller, children }) {

    function emptySpaceOnClick(evt) {
        if(
            !controller.closeOnClick || 
            controller.on !== 'modal' ||
            !controller.windowRef.current
        ) return;

        controller.windowRef.current === evt.target && controller.close();
        return;
    }

    return (
        controller.useDialog ? 
        <dialog className='popup-window' ref={controller.windowRef} onClick={emptySpaceOnClick}>
            { children }
        </dialog> :
        <div className={`popup-window${
            controller.on === 'disabled' ? ' disabled' :
            controller.on === 'modal' ? ' modal' : ''
        }`} ref={controller.windowRef} onClick={emptySpaceOnClick}>
            { children }
        </div>
    );
}

export default PopupWindow;