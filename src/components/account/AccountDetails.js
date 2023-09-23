import React, { useEffect, useState } from 'react';
import '../../styles/account/account_details.css';
import { getByKeyPath } from '../../indexedDB';
import { IDB_ACCOUNT } from '../../settings/types';
import { Person } from 'react-bootstrap-icons';
import EditableField from './EditableField';

function AccountDetails({id, logout, languagePack}) {

    const [userDetails, updateUserDetails] = useState();
    const [editing, setEditing] = useState({username: null, email: null});
    
    // eslint-disable-next-line
    useEffect(requireUpdate, [])

    function requireUpdate() {
        getByKeyPath(IDB_ACCOUNT, id, result=>{
            updateUserDetails(result);
        }, null, ['password']);
    }

    return (
        <div className='account-details'>
            {
                userDetails ? 
                <>
                <div className='avatar'>{ userDetails.avatar ? <></> : <Person className='icon' /> }</div>
                <div className='detail first no-edit'>
                    <div className='detail-title'>{languagePack['User ID']}</div>
                    {userDetails.id}
                </div>
                <EditableField {...{
                    fieldName: 'username',
                    fieldValue: editing.username, 
                    setFieldValue: value=>{setEditing({...editing, username: value})},
                    origValue: userDetails.username,
                    title: 'Username', requireUpdate, id, languagePack
                }}/>
                <EditableField {...{
                    fieldName: 'email',
                    fieldValue: editing.email, 
                    setFieldValue: value=>{setEditing({...editing, email: value})},
                    origValue: userDetails.email,
                    title: 'Email', requireUpdate, id, languagePack
                }}/>
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