import React from 'react';
import '../../styles/nav-bar/sub_menu.css';

function SubMenu({style, children}) {
    return (
        <div className={style}>
            {children ? 
            children.map ?
            children.map(child=>{
                return child
            }) : children : <></>}
        </div>
    );
}

export default SubMenu;