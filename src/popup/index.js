import { useEffect, useRef, useState } from "react"

const useDialog = typeof HTMLDialogElement === 'function';

function usePopup(closeOnClick = false, autoRun = {onOpen: [], onClose: []}) {

    const { onOpen, onClose } = autoRun;

    const [on, switchStatus] = useState('disabled');
    const [onPopupOpen, setOnPopupOpen] = useState(onOpen || [])
    const [onPopupClose, setOnPopupClose] = useState(onClose || [])
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
        let new_idx;
        if(timing === 'open') {
            new_idx = onPopupOpen.length;
            setOnPopupOpen([...onPopupOpen, func])
        } else if(timing === 'close') {
            new_idx = onPopupClose.length
            setOnPopupClose([...onPopupClose, func]);
        }

        return new_idx;
    }

    function removeAutoRun(timing, idx) {
        if(timing === 'open') {
            const cp = onPopupOpen;
            cp[idx] = null;
            setOnPopupOpen(cp);
        } else if(timing === 'close') {
            const cp = onPopupClose;
            cp[idx] = null;
            setOnPopupClose(cp);
        }
    }

    function runAutoRun(timing) {
        if(timing === 'open') onPopupOpen.forEach(func=>func && func());
        if(timing === 'close') onPopupClose.forEach(func=>func && func());
    }

    return { show, showModal, close, addAutoRun, removeAutoRun, useDialog, on, closeOnClick, windowRef }
}

export default usePopup;