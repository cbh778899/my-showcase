import React, { useEffect } from 'react';
import '../../styles/home-page/home.css';
import useLanguage from '../../language';
import HomeSection from './HomeSection';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSearchParams } from '../../actions/getter';

function Home() {

    const { languagePack } = useLanguage();

    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const queryParams = getSearchParams(search);
        
        if(queryParams['edit-password']) {
            navigate('/account/edit-password')
        }
    // eslint-disable-next-line
    }, [search])

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