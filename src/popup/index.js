import { useEffect, useRef, useState } from "react"

const useDialog = typeof HTMLDialogElement === 'function';

function usePopup(closeOnClick = false) {

    const [on, switchStatus] = useState('disabled');
    const windowRef = useRef();

    useEffect(() => {
        if(useDialog && windowRef.current) {
            switch(on) {
                case 'enabled':
                    windowRef.current.show(); break;
                case 'modal':
                    windowRef.current.showModal(); break;
                case 'disabled':
                default:
                    windowRef.current.close(); break;
            }
        }
    }, [on])

    function show() {
        switchStatus('enabled')
    }

    function showModal() {
        switchStatus('modal')
    }

    function close() {
        switchStatus('disabled')
    }

    return { show, showModal, close, useDialog, on, closeOnClick, windowRef }
}

export default usePopup;