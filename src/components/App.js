import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './nav-bar/NavBar';
import Home from './Home';
import Declaimer from './Declaimer';
import HamburgerMenu from './nav-bar/HamburgerMenu';

function App() {
    return (
        <BrowserRouter>
            <HamburgerMenu />
            <NavBar />
            <div className='main-viewport'>
            <Routes>
                <Route path='/' element={<Home />} />
            </Routes>
            <Declaimer />
            </div>
        </BrowserRouter>
    );
}

export default App;