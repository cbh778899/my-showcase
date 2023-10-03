import React from 'react';

function PasswordStrength({strength}) {
    return (
        <div className='password-strength'>
            <span className={strength < 1 ? 'empty' : 'danger'} />
            <span className={strength < 2 ? 'empty' : 'weak'} />
            <span className={strength < 3 ? 'empty' : 'normal'} />
            <span className={strength < 4 ? 'empty' : 'strong'} />
        </div>
    );
}

export default PasswordStrength;