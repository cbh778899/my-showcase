import { useState } from "react";

let registered_components = []
let setPopupAttrs;

function usePopup() {
    const registerComponent = useState()[1]

    useState(()=>{
        registered_components.push(registerComponent)
        return () => {
            registered_components = registered_components.filter(c=>c!==registerComponent);
        }
    }, [registerComponent])

    function initContainer(setter) {
        setPopupAttrs = setter;
    }

    function setPopupWindow({type, actions, displayContent=''}) {

        if(!setPopupAttrs) throw new Error('Container Not Initialized!');

        let displayContentFunc = displayContent;
        if(typeof displayContent === 'string') {
            displayContentFunc = () => { return displayContent }
        }

        setPopupAttrs({
            type, actions, displayContent: displayContentFunc
        });
    }

    return {setPopupWindow, initContainer}
}

export default usePopup;