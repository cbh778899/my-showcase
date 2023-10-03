import React, { useEffect, useState } from 'react';
import '../../styles/account/account_details.css';
import { getByKeyPath } from '../../indexedDB';
import { EDIT_PASSWORD_CHANNEL, EDIT_PASS_ID, IDB_ACCOUNT, REQUEST_CREDENTIAL, SESSION_EXPIRED } from '../../settings/types';
import { Person } from 'react-bootstrap-icons';
import EditableField from './EditableField';
import EditAvatar from './EditAvatar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function AccountDetails({id, logout, languagePack}) {

    const [userDetails, updateUserDetails] = useState(null);
    const [editing, setEditing] = useState({username: null, email: null, avatar: false});
    
    // eslint-disable-next-line
    useEffect(requireUpdate, [])

    function requireUpdate() {
        getByKeyPath(IDB_ACCOUNT, id, result=>{
            if(result && result.avatar) {
                const fileReader = new FileReader()
                fileReader.onload = () => {
                    result.avatar = fileReader.result;
                    updateUserDetails(result);
                }
                fileReader.readAsDataURL(result.avatar);
            } else updateUserDetails(result);
        }, null, ['password']);
    }

    function establishEditPasswordChannel() {
        // wait 500ms for edit password to load
        let response_received = false;
        const channel = new BroadcastChannel(EDIT_PASSWORD_CHANNEL);
        channel.onmessage = function(evt) {
            if(evt.data === REQUEST_CREDENTIAL) {
                channel.postMessage({type: EDIT_PASS_ID, id})
            } else {
                response_received = true;
                evt.data.status && logout(languagePack['password-changed-logout']);
            }
        }
        channel.onmessageerror = function(err){ toast.error(err.data) }
        
        // wait for 5 minutes, if no response, send session expired message and close channel
        setTimeout(() => {
            if(!response_received && channel) {
                channel.postMessage(SESSION_EXPIRED);
                channel.close();
            }
        }, 300000);
    }

    return (
        <div className='account-details account-global'>
            {
                userDetails ? 
                <>
                <EditAvatar 
                    display={editing.avatar} 
                    close={()=>setEditing({...editing, avatar: false})}
                    id={userDetails.id} requireUpdate={requireUpdate}
                    languagePack={languagePack} />
                <div className='avatar clickable' onClick={()=>setEditing({...editing, avatar: true})}>
                    <div className='edit-avatar'><span>{languagePack['Edit Avatar']}</span></div>
                    { userDetails.avatar ? 
                        <img alt={languagePack['avatar']} src={userDetails.avatar} /> : 
                        <Person className='icon' /> 
                    }
                </div>
                <div className='detail first'>
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
                <Link to='edit-password' target='_blank'
                    className='function-text clickable'
                    onClick={establishEditPasswordChannel}
                >
                    {languagePack['Edit Password']}
                </Link>
                <div className='logout-container'>
                    <div className='logout clickable' onClick={logout}>{languagePack['Logout']}</div>
                </div>
                </> : 
                <div className='show-loading'>{languagePack['Loading...']}</div>
            }
        </div>
    );
}

export default AccountDetails;