import React, { useState } from 'react';
import { ACCOUNT_LOGIN_PAGE } from '../../settings/types';
import Login from './Login';
import Register from './Register';
import AccountDetails from './AccountDetails';
import useLanguage from '../../language';

function Account() {
    const [loginID, setLoginID] = useState(null);
    const [displayPage, switchDisplayPage] = useState(ACCOUNT_LOGIN_PAGE)
    const { languagePack } = useLanguage();

    return (
        loginID !== null ?
        <AccountDetails /> :
        (displayPage === ACCOUNT_LOGIN_PAGE ?
        <Login {...{setLoginID, switchDisplayPage, languagePack}} /> :
        <Register {...{setLoginID, switchDisplayPage, languagePack}} />)
    );
}

export default Account;