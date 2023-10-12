import React, { useEffect, useRef, useState } from 'react';
import '../../styles/popup/container.css';
import usePopup from '../../popup';
import { POPUP_YES_NO } from '../../settings/types';
import YesNo from './YesNo';
import useLanguage from '../../language';

function Container() {

    const { initContainer } = usePopup();
    const [attrs, setAttrs] = useState({
        type: null, actions: null, displayContent: null
    })
    const [popupWindow, setPopupWindow] = useState(null)
    const containerRef = useRef();
    const currentWindowRef = useRef();
    const { languagePack } = useLanguage();
    
    // eslint-disable-next-line
    useEffect(()=>initContainer(setAttrs));

    useEffect(()=>{
        containerRef.current.style.zIndex = 15;
        switch(attrs.type) {
            case POPUP_YES_NO:
                setPopupWindow(<YesNo {...{
                    actions: attrs.actions, close, showWindow,
                    displayContent: attrs.displayContent,
                    languagePack, ref: currentWindowRef}} 
                />);
                break;
        default: containerRef.current.style.zIndex = -1; break;
        }
    }, [attrs, languagePack])

    function showWindow(current_pointer) {
        if(current_pointer) {
            // read clientHeight or other attributes to force render
            // eslint-disable-next-line
            current_pointer.clientHeight;
            current_pointer.style.transform = 'scale(1)';
        }
    }

    async function close(func) {
        func && func();
        if(currentWindowRef.current) {
            currentWindowRef.current.style.transform = 'scale(0)';
            // wait for window to perform close
            await new Promise(s=>setTimeout(s, 300));
        }
        setPopupWindow(null);
        setAttrs({type: null, actions: null, displayContent: null})
    }

    return (
        <div className='popup-window-container' ref={containerRef}>
            { popupWindow || <></> }
        </div>
    );
}

export default Container;