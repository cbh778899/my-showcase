import React, { forwardRef, useEffect } from 'react';

function YesNo({actions, close, showWindow, displayContent, languagePack}, ref) {

    // eslint-disable-next-line
    useEffect(()=>{showWindow(ref.current)}, [ref.current]);

    return (
        <div className='popup-window' ref={ref}>
            <div className='display-content'>{ displayContent() }</div>
            <div className='popup-btn blue-btn clickable' onClick={()=>close(actions.Yes)}>
                    {languagePack['Yes']}
            </div>
            <div className='popup-btn red-btn clickable' onClick={()=>close(actions.No)}>
                    {languagePack['No']}
            </div>
        </div>
    );
}

export default forwardRef(YesNo);