import React, { useEffect, useState } from 'react';
import '../../styles/account/account_details.css';
import { getByKeyPath } from '../../indexedDB';
import { IDB_ACCOUNT } from '../../settings/types';

function AccountDetails({id, logout, languagePack}) {

    const [userDetails, updateUserDetails] = useState();
    
    useEffect(()=>{
        getByKeyPath(IDB_ACCOUNT, id, result=>{
            console.log(result)
            updateUserDetails(result);
        }, null, ['password'])
    // eslint-disable-next-line
    }, [])

    return (
        <div className='account-details'>
            {
                userDetails ? 
                <>
                <div>{languagePack['User ID']}: {userDetails.id}</div>
                <div>{languagePack['Username']}: {userDetails.username}</div>
                <div>{languagePack['Email']}: {userDetails.email}</div>
                <div onClick={logout}>{languagePack['Logout']}</div>
                </> : 
                <div className='show-loading'>{languagePack['Loading...']}</div>
            }
        </div>
    );
}

export default AccountDetails;