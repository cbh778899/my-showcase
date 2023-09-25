import React from 'react';
import '../../styles/nav-bar/sub_menu_item.css';

function SubMenuItem({title, onClick}) {
    return (
        <div className='sub-menu-item clickable' onClick={onClick}>
            {title}
        </div>
    );
}

export default SubMenuItem;