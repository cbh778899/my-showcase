import React from 'react';
import '../../styles/nav-bar/top_nav_bar.css';
import NavBarItem from './NavBarItem';
import SubMenu from './SubMenu';
import { SUB_MENU_BLOCK, SUB_MENU_DROPDOWN } from '../../settings/types';
import SubMenuItem from './SubMenuItem';

function TopNavBar() {
    return (
        <div className='top-nav-bar'>
            <NavBarItem title='Home' />
            <NavBarItem title='Functional Pages'>
                <SubMenu style={SUB_MENU_BLOCK}>
                    <SubMenuItem title='Function 1' />
                    <SubMenuItem title='Function 2' />
                    <SubMenuItem title='Function 3' />
                    <SubMenuItem title='Function 4' />
                    <SubMenuItem title='Function 5' />
                    <SubMenuItem title='Function 6' />
                    <SubMenuItem title='Function 7' />
                </SubMenu>
            </NavBarItem>
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