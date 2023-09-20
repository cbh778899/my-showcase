import React from 'react';
import '../../styles/nav-bar/top_nav_bar.css';
import NavBarItem from './NavBarItem';
import SubMenu from './SubMenu';
import { SUB_MENU_DROPDOWN } from '../../settings/types';
import SubMenuItem from './SubMenuItem';

function TopNavBar() {
    return (
        <div className='top-nav-bar'>
            <NavBarItem title='Home' />
            <NavBarItem title='Language'>
                <SubMenu style={SUB_MENU_DROPDOWN}>
                    <SubMenuItem title='English' />
                    <SubMenuItem title='简体中文' />
                </SubMenu>
            </NavBarItem>
        </div>
    );
}

export default TopNavBar;