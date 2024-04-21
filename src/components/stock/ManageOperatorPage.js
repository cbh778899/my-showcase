import React, { useEffect, useState } from 'react';
import PopupWindow from '../popup'
import { Trash } from 'react-bootstrap-icons';
import { OPERATOR_SYSTEM, STOCK_ADMIN_DEFAULT_PASSWORD } from '../../settings/types';
import usePopup from '../../popup';
import { toast } from 'react-toastify';

function ManageOperatorPage({ controller, languagePack }) {

    const [operators, setOperators] = useState([OPERATOR_SYSTEM])
    const [managerValidated, setMgrValidated] = useState(false);

    const [rmSelected, setRmSelected] = useState({});
    
    const askPasswordController = usePopup(true);
    const askDetailsController = usePopup(true);
    const askRmConfirmController = usePopup(true);

    useEffect(() => {
        // ask db for operators
    }, [])

    function removeOperator() {
        const operatorID = rmSelected.id
    }

    function addOperator(evt) {
        const operator_name = evt.target['operator-name'];
        
        // store operator to db
    }

    function submitAdminPassword(evt) {
        evt.preventDefault();
        const password = evt.target['admin-password'].value;
        const validatePassword = localStorage.getItem('stock-admin-password') || STOCK_ADMIN_DEFAULT_PASSWORD;
        if(password === validatePassword) {
            setMgrValidated(true);
            askPasswordController.close();
            askDetailsController.showModal();
            toast.success(languagePack['admin-password-validated']);
        } else {
            toast.error(languagePack['admin-password-incorrect']);
        }
    }

    return (
        <PopupWindow controller={controller}>
            <div className='styled-popup-content manage-operator'>
                <table>
                    <caption>
                        <span onClick={() => {
                            if(!managerValidated) {
                                askPasswordController.showModal();
                            } else {
                                askDetailsController.showModal();
                            }
                        }} className='clickable'>
                            { languagePack['click-to-add-operator'] }
                        </span>
                    </caption>
                    <thead>
                        <tr className='title'>
                            <th>Operator ID</th>
                            <th>Operator Name</th>
                            <th>Remove Operator</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            operators.map((operator, i) => {
                                return (
                                    <tr key={`operator-row-${i}`}>
                                        <td>{ operator.id }</td>
                                        <td>{ operator.name }</td>
                                        <td>
                                            { operator.removable ? 
                                                <Trash 
                                                    className='remove-icon' 
                                                    onClick={()=> {
                                                        setRmSelected(operator);
                                                        askRmConfirmController.showModal();
                                                    }} 
                                                /> : 
                                                languagePack['Not Removable'] 
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div 
                    className='popup-btn blue-btn clickable'
                    onClick={controller.close}
                >{ languagePack['Finished'] }</div>
            </div>
            <PopupWindow controller={askPasswordController}>
                <form className='styled-popup-content' onSubmit={submitAdminPassword}>
                    <div className='display-content'>
                        { languagePack['ask-admin-password'] }
                    </div>
                    <input name='admin-password' type='text' />
                    <input type='submit' className='popup-btn blue-btn clickable' value={languagePack['Submit']} />
                    <div className='popup-btn clickable' onClick={askPasswordController.close}>
                        { languagePack['Cancel'] }
                    </div>
                </form>
            </PopupWindow>
            <PopupWindow controller={askDetailsController}>
                <form className='styled-popup-content' onSubmit={addOperator}>
                    <div className='input-block'>
                        <div className='title'>{ languagePack['Operator Name'] }</div>
                        <input type='text' name='operator-name'/>
                    </div>
                    <button className='popup-btn blue-btn clickable'>
                        { languagePack['Submit'] }
                    </button>
                    <div className='popup-btn clickable' onClick={askDetailsController.close}>
                        { languagePack['Cancel'] }
                    </div>
                </form>
            </PopupWindow>
            <PopupWindow controller={askRmConfirmController}>
                <div className='styled-popup-content'>
                    <div className='display-content'>
                        {
                            rmSelected.id ? 
                            languagePack['confirm-remove-operator'] :
                            languagePack['ask-select-operator-to-remove']
                        }
                    </div>
                    {
                        rmSelected.id ? 
                        <div className='popup-btn blue-btn clickable' onClick={removeOperator}>
                            { languagePack['Confirm'] }
                        </div> :
                        <></>
                    }
                    <div className='popup-btn clickable' onClick={askRmConfirmController.close}>
                        { languagePack['Cancel'] }
                    </div>
                </div>
            </PopupWindow>
        </PopupWindow>
    );
}

export default ManageOperatorPage;