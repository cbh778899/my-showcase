import React from 'react';
import '../../styles/nav-bar/nav_bar.css';
import NavBarItem from './NavBarItem';
import SubMenu from './SubMenu';
import { LANGUAGE_CN, LANGUAGE_EN, SUB_MENU_BLOCK, SUB_MENU_DROPDOWN } from '../../settings/types';
import SubMenuItem from './SubMenuItem';
import { Link } from 'react-router-dom';
import useLanguage from '../../language';
import { XLg } from 'react-bootstrap-icons';
import { deleteDB, initDB } from '../../indexedDB';

function NavBar({status, setStatus}) {
    const { languagePack, setLanguage } = useLanguage();
    return (
        <div className={`nav-bar${status ? ' nav-bar-expanded' : ''}`}>
            <XLg className='close-icon' onClick={()=>setStatus(false)} />
            <Link to='/' className='nav-bar-item'>{languagePack['Home']}</Link>
            <NavBarItem title={languagePack['Functional Pages']}>
                <SubMenu style={SUB_MENU_BLOCK}>
                    <Link to='/account' className='sub-menu-item'>{languagePack['Account Page']}</Link>
                </SubMenu>
            </NavBarItem>
            <NavBarItem title={languagePack['IndexedDB Settings']}>
                <SubMenu style={SUB_MENU_DROPDOWN}>
                    <SubMenuItem title={languagePack['Initialize IndexedDB Manually']} onClick={()=>initDB(true)} />
                    <SubMenuItem title={languagePack['Delete Current IndexedDB']} onClick={deleteDB} />
                </SubMenu>
            </NavBarItem>
            <NavBarItem title={languagePack['More']}>
                <SubMenu style={SUB_MENU_DROPDOWN}>
                    <Link target='blank' to='https://www.github.com/cbh778899' className='sub-menu-item'>{languagePack['GitHub']}</Link>
                    <Link target='blank' to='https://www.linkedin.com/in/bohan-cheng-aa109a250/' className='sub-menu-item'>{languagePack['LinkedIn']}</Link>
                </SubMenu>
            </NavBarItem>
            <NavBarItem title={languagePack['Language']}>
                <SubMenu style={SUB_MENU_DROPDOWN}>
                    <SubMenuItem title='English' onClick={()=>{setLanguage(LANGUAGE_EN)}} />
                    <SubMenuItem title='简体中文' onClick={()=>{setLanguage(LANGUAGE_CN)}} />
                </SubMenu>
            </NavBarItem>
        </div>
    );
}

export default NavBar;