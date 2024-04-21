import React, { useEffect, useState } from 'react';
import '../../styles/stock/stock_manager.css'
import StockNavPanel from './StockNavPanel';
import StockTable from './StockTable';
import { getCurrentStock } from '../../actions/stock_actions';
import useLanguage from '../../language';

function StockManager() {

    const { languagePack } = useLanguage();
    const [stock, setStock] = useState([]);

    useEffect(() => {
        getCurrentStock(s=>setStock(s))
    }, [])

    return (
        <div className='stock-manager'>
            <StockNavPanel languagePack={languagePack} />
            <StockTable stock={stock} languagePack={languagePack} />
        </div>
    );
}

export default StockManager;