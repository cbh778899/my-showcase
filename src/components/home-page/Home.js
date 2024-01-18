import React from 'react';
import '../../styles/home-page/home.css';
import useLanguage from '../../language';
import HomeSection from './HomeSection';

function Home() {

    const { languagePack } = useLanguage();

    return (
        <div className='home'>
            <div className='home-contents'>
                {
                    languagePack['home-page-content'].map((e, i)=>{
                        return <HomeSection key={`home-section-${i}`} title={e.title} content={e.content} />
                    })
                }
            </div>
        </div>
    );
}

export default Home;