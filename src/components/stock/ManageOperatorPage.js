import React, { useState } from 'react';
import PopupWindow from '../popup'
import { Trash } from 'react-bootstrap-icons';
import usePopup from '../../popup';
import { toast } from 'react-toastify';
import { addOperator as addOpAction, removeOperator as rmOpAction } from '../../actions/stock_actions';

function ManageOperatorPage({ controller, languagePack, operators, reqUpdateOperators }) {

    const [rmSelected, setRmSelected] = useState({});
    const [generatedPassword, setGeneratedPassword] = useState('')
    
    const askDetailsController = usePopup(true);
    const askRmConfirmController = usePopup(true);
    const autoGeneratePasswordController = usePopup();

    function removeOperator() {
        rmOpAction(rmSelected.id).then(res=>{
            if(res) {
                toast.success(languagePack['rm-operator-success']);
                setRmSelected({})
                askRmConfirmController.close();
                reqUpdateOperators();
            } else {
                toast.error(languagePack['rm-operator-failed'])
            }
        })
    }

    async function addOperator(evt) {
        evt.preventDefault();

        const operator_name = evt.target['operator-name'].value;
        const operator_password = evt.target['operator-password'].value || null;

        const password = await addOpAction(operator_name, operator_password)
        if(password) {
            reqUpdateOperators();
            if(!operator_password) {
                setGeneratedPassword(password);
                autoGeneratePasswordController.showModal();
            }
            askDetailsController.close();
            evt.target['operator-name'].value = '';
            evt.target['operator-password'].value = '';
        }
    }

    async function copyPassword() {
        try {
            await navigator.clipboard.writeText(generatedPassword);
            toast.success(languagePack['copy-password-success'])
        } catch(error) {
            toast.error(error)
        }
    }

    return (
        <PopupWindow controller={controller}>
            <div className='styled-popup-content manage-operator'>
                <table>
                    <caption>
                        <span onClick={askDetailsController.showModal} className='clickable'>
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
                        {operators.map((operator, i) => {
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
                            </tr>)
                        })}
                    </tbody>
                </table>
                <div 
                    className='popup-btn blue-btn clickable'
                    onClick={controller.close}
                >{ languagePack['Finished'] }</div>
            </div>
            <PopupWindow controller={askDetailsController}>
                <form className='styled-popup-content' onSubmit={addOperator}>
                    <div className='input-block'>
                        <div className='title'>{ languagePack['Operator Name'] }</div>
                        <input className='input-type' type='text' name='operator-name'/>
                    </div>
                    <div className='input-block'>
                        <div className='title'>{ languagePack['Operator Password'] }</div>
                        <input className='input-type' type='text' name='operator-password' placeholder={languagePack['Auto generated']} />
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
                            languagePack['confirm-remove-operator'](rmSelected.name) :
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
            <PopupWindow controller={autoGeneratePasswordController}>
                <div className='styled-popup-content'>
                    <div className='display-content'>{ languagePack['auto-gen-password-is'] } <strong>{ generatedPassword }</strong></div>
                    <div className='popup-btn blue-btn clickable' onClick={copyPassword}>
                        { languagePack['copy-password'] }
                    </div>
                    <div className='popup-btn clickable' onClick={autoGeneratePasswordController.close}>
                        { languagePack['Cancel'] }
                    </div>
                </div>
            </PopupWindow>
        </PopupWindow>
    );
}

export default ManageOperatorPage;