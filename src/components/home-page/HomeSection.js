import React from 'react';
import '../../styles/home-page/home_section.css';
import Paragraph from './Paragraph';

function HomeSection({title, content}) {
    return (
        <section className='home-section'>
            <div className='section-text-box'>
                <div className='title'>{ title }</div>
                <div className='content'>
                    { 
                        content.split('</br>')
                        .map((e, i)=>
                            <Paragraph key={`para-${i}`} content={e} />
                        ) 
                    }
                </div>
            </div>
        </section>
    );
}

export default HomeSection;
// /(\*\*([^*]*)\*\*)/g