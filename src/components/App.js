import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './nav-bar/NavBar';
import Home from './Home';
import Declaimer from './Declaimer';
import HamburgerMenu from './nav-bar/HamburgerMenu';
import useLanguage from '../language';
import { initDB, updateLanguagePack } from '../indexedDB';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Account from './account';

function App() {

    const [navBarStatus, setNavBarStatus] = useState(false);
    const { languagePack } = useLanguage();

    useEffect(()=>{
        // init the indexed db
        initDB();
    }, [])

    useEffect(()=>{
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
            </Routes>
            <Declaimer />
            </div>
            <ToastContainer />
        </BrowserRouter>
    );
}

export default App;