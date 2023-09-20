import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNavBar from './nav-bar/TopNavBar';
import Home from './Home';
import Declaimer from './Declaimer';

function App() {
    return (
        <BrowserRouter>
            <TopNavBar />
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