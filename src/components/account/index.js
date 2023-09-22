import React, { useState } from 'react';
import { ACCOUNT_LOGIN_PAGE } from '../../settings/types';
import Login from './Login';
import Register from './Register';
import AccountDetails from './AccountDetails';
import useLanguage from '../../language';
import { toast } from 'react-toastify';
import toastify_settings from '../../settings/toastify_settings';

function Account() {
    const [loginID, setLoginID] = useState(null);
    const [displayPage, switchDisplayPage] = useState(ACCOUNT_LOGIN_PAGE)
    const { languagePack } = useLanguage();

    function logout() {
        setLoginID(null);
        switchDisplayPage(ACCOUNT_LOGIN_PAGE);
        toast.success(languagePack['Logout Success!'], toastify_settings);
    }

    return (
        loginID !== null ?
        <AccountDetails {...{id: loginID, logout, languagePack}} /> :
        (displayPage === ACCOUNT_LOGIN_PAGE ?
        <Login {...{setLoginID, switchDisplayPage, languagePack}} /> :
        <Register {...{setLoginID, switchDisplayPage, languagePack}} />)
    );
}

export default Account;