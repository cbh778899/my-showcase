import React, { useState } from 'react';
import { ACCOUNT_LOGIN_PAGE } from '../../settings/types';
import Login from './Login';
import Register from './Register';
import AccountDetails from './AccountDetails';
import useLanguage from '../../language';
import { toast } from 'react-toastify';
import { generateID } from '../../actions/generator';

function Account() {
    const [loginID, setLoginID] = useState(null);
    const [displayPage, switchDisplayPage] = useState(ACCOUNT_LOGIN_PAGE)
    const tabID = useState(generateID())[0]
    const { languagePack } = useLanguage();

    function logout(msg = null) {
        setLoginID(null);
        switchDisplayPage(ACCOUNT_LOGIN_PAGE);
        typeof msg === 'string' ? toast.warning(msg) : toast.success(languagePack['Logout Success!']);
    }

    return (
        loginID !== null ?
        <AccountDetails {...{id: loginID, logout, tabID, languagePack}} /> :
        (displayPage === ACCOUNT_LOGIN_PAGE ?
        <Login {...{setLoginID, switchDisplayPage, tabID, languagePack}} /> :
        <Register {...{setLoginID, switchDisplayPage, languagePack}} />)
    );
}

export default Account;