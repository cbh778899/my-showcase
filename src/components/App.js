import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './nav-bar/NavBar';
import Home from './home-page/Home';
import Declaimer from './Declaimer';
import HamburgerMenu from './nav-bar/HamburgerMenu';
import useLanguage from '../language';
import { initDB, updateLanguagePack } from '../indexedDB';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Account from './account';
import toastify_settings from '../settings/toastify_settings';
import EditPassword from './account/EditPassword';
import { default as PopupContainer } from './popup/Container';

function App() {

    const [navBarStatus, setNavBarStatus] = useState(false);
    const { languagePack } = useLanguage();

    useEffect(()=>{
        // init the indexed db
        initDB();
    }, [])

    useEffect(()=>{
        // set tag title
        document.title = languagePack['homepage-title'];
        // update language pack for db notification
        updateLanguagePack(languagePack);
    }, [languagePack])

    return (
        <BrowserRouter>
            <HamburgerMenu setNavBarStatus={setNavBarStatus} />
            <NavBar status={navBarStatus} setStatus={setNavBarStatus} />
            <div className='main-viewport'>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/account' element={<Account />} />
                <Route path='/edit-password' element={<EditPassword />} />
            </Routes>
            <Declaimer />
            </div>
            <PopupContainer />
            <ToastContainer {...toastify_settings} />
        </BrowserRouter>
    );
}

export default App;