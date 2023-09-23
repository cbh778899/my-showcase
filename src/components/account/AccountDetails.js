import React, { useEffect, useState } from 'react';
import '../../styles/account/account_details.css';
import { getByKeyPath } from '../../indexedDB';
import { IDB_ACCOUNT } from '../../settings/types';
import { Person } from 'react-bootstrap-icons';

function AccountDetails({id, logout, languagePack}) {

    const [userDetails, updateUserDetails] = useState();
    
    useEffect(()=>{
        getByKeyPath(IDB_ACCOUNT, id, result=>{
            updateUserDetails(result);
        }, null, ['password'])
    // eslint-disable-next-line
    }, [])

    return (
        <div className='account-details'>
            {
                userDetails ? 
                <>
                <div className='avatar'>{ userDetails.avatar ? <></> : <Person className='icon' /> }</div>
                <div className='detail first no-edit'>
                    <div className='detail-title'>{languagePack['User ID']}</div>
                    {userDetails.id}
                </div><div className='detail'>
                    <div className='detail-title'>{languagePack['Username']}</div>
                    {userDetails.username}
                </div><div className='detail'>
                    <div className='detail-title'>{languagePack['Email']}</div>
                    {userDetails.email}
                </div>
                <div className='logout-container'>
                    <div className='logout' onClick={logout}>{languagePack['Logout']}</div>
                </div>
                </> : 
                <div className='show-loading'>{languagePack['Loading...']}</div>
            }
        </div>
    );
}

export default AccountDetails;