import React, { useEffect, useState } from 'react';
import PopupWindow from '../popup'
import { Trash } from 'react-bootstrap-icons';
import { OPERATOR_SYSTEM } from '../../settings/types';
import usePopup from '../../popup';
import { toast } from 'react-toastify';
import { getOperators, addOperator as addOpAction, removeOperator as rmOpAction } from '../../actions/stock_actions';

function ManageOperatorPage({ controller, languagePack }) {

    const [operators, setOperators] = useState([OPERATOR_SYSTEM])
    const [rmSelected, setRmSelected] = useState({});
    
    const askDetailsController = usePopup(true);
    const askRmConfirmController = usePopup(true);

    useEffect(() => {
        controller.addAutoRun('open', async ()=>{
            setOperators([OPERATOR_SYSTEM, ...(await getOperators())])
        })
    // eslint-disable-next-line
    }, [])

    function removeOperator() {
        rmOpAction(rmSelected.id).then(res=>{
            if(res) {
                toast.success(languagePack['rm-operator-success']);
                setOperators(operators.filter(e=>e.id !== rmSelected.id))
                setRmSelected({})
                askRmConfirmController.close();
            } else {
                toast.error(languagePack['rm-operator-failed'])
            }
        })
    }

    async function addOperator(evt) {
        evt.preventDefault();

        const operator_name = evt.target['operator-name'].value;
        const id = await addOpAction(operator_name)
        if(id) {
            setOperators([
                ...operators, 
                { id, name: operator_name, removable: true }
            ])
            askDetailsController.close();
            evt.target['operator-name'].value = '';
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