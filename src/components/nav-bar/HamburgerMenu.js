import React from 'react';
import '../../styles/nav-bar/hamburger_menu.css';
import { List } from 'react-bootstrap-icons';

function HamburgerMenu({setNavBarStatus}) {
    return (
        <div className='hamburger-menu' onClick={()=>setNavBarStatus(true)}>
            <List className='icon' />
        </div>
    );
}

export default HamburgerMenu;