import React from 'react';
import '../styles/declaimer.css';
import useLanguage from '../language';

function Declaimer() {
    const { languagePack } = useLanguage();
    return (
        <div className='declaimer'>
            <span>2023 &copy; {languagePack['Lililele']}</span>
            <span>{languagePack['contact-me']}</span>
        </div>
    );
}

export default Declaimer;