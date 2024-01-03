import React from 'react';
import '../styles/home.css';

function Home() {
    return (
        <div className='home'>
            <div className='home-contents'>
                <section>
                    <div className='section-text-box'>
                        <div className='title'>Home Page</div>
                        <div className='content'>
                            Welcome to my homepage!<br/>
                            There are plenty of interesting functions implemented only using frontend techniques waiting for explore.
                            <br/><br/>
                            Scroll down to see more descriptions!
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;