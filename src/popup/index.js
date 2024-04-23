import { useEffect, useRef, useState } from "react"

const useDialog = typeof HTMLDialogElement === 'function';

function usePopup(closeOnClick = false, autoRun = {onOpen: [], onClose: []}) {

    const { onOpen, onClose } = autoRun;

    const [on, switchStatus] = useState('disabled');
    const [onPopupOpen, setOnPopupOpen] = useState(onOpen)
    const [onPopupClose, setOnPopupClose] = useState(onClose)
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
        runAutoRun('open')
    }

    function showModal() {
        switchStatus('modal')
        runAutoRun('open')
    }

    function close() {
        switchStatus('disabled')
        runAutoRun('close')
    }

    function addAutoRun(timing, func) {
        if(timing === 'open') setOnPopupOpen([...onPopupOpen, func])
        else if(timing === 'close') setOnPopupClose([...onPopupClose, func]);
    }

    function runAutoRun(timing) {
        if(timing === 'open') onPopupOpen.forEach(func=>func());
        if(timing === 'close') onPopupClose.forEach(func=>func());
    }

    return { show, showModal, close, addAutoRun, useDialog, on, closeOnClick, windowRef }
}

export default usePopup;