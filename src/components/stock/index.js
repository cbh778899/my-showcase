import React, { useEffect, useState } from 'react';
import '../../styles/stock/stock_manager.css'
import StockNavPanel from './StockNavPanel';
import StockTable from './StockTable';
import { getCurrentStock, getOperators } from '../../actions/stock_actions';
import useLanguage from '../../language';
import { OPERATOR_SYSTEM } from '../../settings/types';

function StockManager() {

    const { languagePack } = useLanguage();
    const [stock, setStock] = useState([]);
    const [operators, setOperators] = useState([OPERATOR_SYSTEM])

    useEffect(() => {
        reqUpdateStock();
        reqUpdateOperators();
    }, [])

    async function reqUpdateStock() {
        setStock(await getCurrentStock())
    }

    async function reqUpdateOperators() {
        setOperators([OPERATOR_SYSTEM, ...(await getOperators())])
    }

    return (
        <div className='stock-manager'>
            <StockNavPanel 
                languagePack={languagePack} operators={operators} 
                reqUpdateOperators={reqUpdateOperators} 
                reqUpdateStock={reqUpdateStock}
            />
            <StockTable 
                languagePack={languagePack} 
                operators={operators} stock={stock} 
                reqUpdateStock={reqUpdateStock}
            />
        </div>
    );
}

export default StockManager;