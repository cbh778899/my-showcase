import React from 'react';
import '../../styles/nav-bar/nav_bar_item.css';

function NavBarItem({title, children, onClick}) {
    return (
        <div className='nav-bar-item clickable' onClick={onClick}>
            {title}
            {children || <></>}
        </div>
    );
}

export default NavBarItem;