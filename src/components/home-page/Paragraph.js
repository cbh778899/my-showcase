import React from 'react';
import '../../styles/home-page/paragraph.css';

function Paragraph({content}) {
    return (
        <div className='paragraph'>
            { 
                content.split('**').map((e, i) => {
                    return (
                        i % 2 ?
                        <strong key={`part-${i}`}>{e}</strong> :
                        <span key={`part-${i}`}>{e}</span>
                    )
                })
            }
        </div>
    );
}

export default Paragraph;