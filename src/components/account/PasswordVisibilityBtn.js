import React from 'react';
import '../../styles/account/login.css';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

function PasswordVisibilityBtn({visibility, setVisibility}) {
    return (
        visibility ? 
        <EyeSlash className='change-visibility-icon clickable' onClick={()=>setVisibility(false)} /> :
        <Eye className='change-visibility-icon clickable' onClick={()=>setVisibility(true)} />
    );
}

export default PasswordVisibilityBtn;