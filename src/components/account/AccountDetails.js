import React, { useEffect, useState } from 'react';
import '../../styles/account/account_details.css';
import { getByKeyPath } from '../../indexedDB';
import { ANSWER_CREDENTIAL, ANSWER_PAIR, CHANNEL_ONLINE, EDIT_PASSWORD_CHANNEL, EDIT_PASS_ID, IDB_ACCOUNT, PASSWORD_CHANGED, REQUEST_CREDENTIAL, REQUEST_PAIR, SESSION_EXPIRED } from '../../settings/types';
import { Person } from 'react-bootstrap-icons';
import EditableField from './EditableField';
import EditAvatar from './EditAvatar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { generateID } from '../../actions/generator';
import useLanguage from '../../language';

function AccountDetails({id, logout, tabID}) {

    const { languagePack, currLanguage } = useLanguage();
    const [userDetails, updateUserDetails] = useState(null);
    const [editing, setEditing] = useState({username: null, email: null, avatar: false});
    
    useEffect(()=>{
        requireUpdate();
        return () => {
            userDetails && userDetails.avatar && URL.revokeObjectURL(userDetails.avatar);
        }
    // eslint-disable-next-line
    }, [])

    function requireUpdate() {
        userDetails && userDetails.avatar && URL.revokeObjectURL(userDetails.avatar);
        getByKeyPath(IDB_ACCOUNT, id, result=>{
            if(result && result.avatar) {
                result.avatar = URL.createObjectURL(result.avatar);
                updateUserDetails(result);
            } else updateUserDetails(result);
        }, {exclude: ['password']});
    }

    function establishEditPasswordChannel() {
        // wait 500ms for edit password to load
        let response_received = false;
        let paired = false;
        const channelID = generateID();
        const channel = new BroadcastChannel(EDIT_PASSWORD_CHANNEL);

        channel.onmessage = function(evt) {
            const msg = evt.data;
            const sendMsg = { channelID, tabID, currLanguage }
            
            if(!paired && msg.type === REQUEST_PAIR) {
                sendMsg.type = ANSWER_PAIR
                paired = true;
            } else if(msg.channelID === channelID) {
                if(msg.type === REQUEST_CREDENTIAL) {
                    sendMsg.type = ANSWER_CREDENTIAL
                    sendMsg.body = {
                        from: EDIT_PASS_ID, id
                    }
                } else if(msg.type === PASSWORD_CHANGED) {
                    response_received = true;
                    toast.success(languagePack['password-updated-id']);
                    channel.close();
                    logout(languagePack['password-changed-logout']);
                    return;
                }
            } else if(msg.tabID === tabID && msg.type === CHANNEL_ONLINE) {
                response_received = true;
                sendMsg.type = SESSION_EXPIRED;
            }

            channel.postMessage(sendMsg)
            sendMsg.type === SESSION_EXPIRED && channel.close();
        }
        channel.onmessageerror = function(err){ toast.error(err.data) }
        
        // wait for 5 minutes, if no response, send session expired message and close channel
        setTimeout(() => {
            if(!response_received && channel) {
                channel.postMessage({
                    channelID,
                    type: SESSION_EXPIRED
                });
                channel.close();
            }
        }, 300000);

        // send online message
        channel.postMessage({channelID, tabID, type: CHANNEL_ONLINE})
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