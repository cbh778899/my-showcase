import React, { useEffect, useRef, useState } from 'react';
import '../../styles/stock/stock_table.css';

function StockTable({stock, languagePack}) {

    const [itemsEachPage, setItemsEachPage] = useState(20)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(0);
    const [displayItems, setDisplayItems] = useState([]);

    const lastPageRef = useRef();
    const nextPageRef = useRef();

    function sliceStock(given_stock = null) {
        given_stock = given_stock || stock
        const start_index = currentPage * itemsEachPage
        return given_stock.slice(start_index, start_index + itemsEachPage);
    }

    function updateTotalPages() {
        setTotalPages(Math.ceil(stock.length / itemsEachPage));
    }

    function updateDisplayItems() {
        setDisplayItems(sliceStock());
    }

    function updateCurrentPage(page) {
        if(!totalPages) return;

        if(page >= totalPages) page = totalPages - 1;
        else if(page < 0) page = 0;
        
        setCurrentPage(page);
    }

    useEffect(() => {
        if(sliceStock().map(e=>e.id).join('') !== displayItems.map(e=>e.id).join('')) {
            currentPage ? updateCurrentPage(0) : updateDisplayItems();
        }
    // eslint-disable-next-line
    }, [stock])

    useEffect(() => {
        updateDisplayItems();
    // eslint-disable-next-line
    }, [currentPage])

    useEffect(() => {
        updateCurrentPage(0);
    // eslint-disable-next-line
    }, [itemsEachPage])

    useEffect(() => {
        updateTotalPages();
    // eslint-disable-next-line
    }, [stock, itemsEachPage])

    return (
        <div className='stock-table'>
            <table>
                <caption>
                    <div>
                    {
                        displayItems.length ? 
                        `${
                            languagePack['Displaying Stock']
                        } ${
                            currentPage*itemsEachPage+1
                        }-${
                            Math.min((currentPage+1)*itemsEachPage, stock.length)
                        }` : 
                        languagePack['no-stock']
                    }
                    </div>
                    <div className='select-page-container'>
                        <div 
                            className={`switch-page-btn clickable${
                                currentPage <= 0 ? ' disabled' : ''
                            }`}
                            ref={lastPageRef}
                            onClick={()=>{updateCurrentPage(currentPage - 1)}}
                        >{languagePack['Last Page']}</div>
                        <div className='page-number'>
                            <span 
                                className='switch-page-btn clickable'
                            >{ Math.min(currentPage + 1, totalPages) }</span>
                            <span> / { totalPages }</span>  </div>
                        <div 
                            className={`switch-page-btn clickable${
                                currentPage >= totalPages - 1 ? ' disabled' : ''
                            }`} 
                            ref={nextPageRef}
                            onClick={()=>{updateCurrentPage(currentPage + 1)}}
                        >{languagePack['Next Page']}</div>
                    </div>
                </caption>
                <thead>
                    <tr>
                        <th scope='col'>{languagePack['Item ID']}</th>
                        <th scope='col'>{languagePack['Item Name']}</th>
                        <th scope='col'>{languagePack['Item Stock']}</th>
                        <th scope='col'>{languagePack['Item Price']}</th>
                    </tr>
                </thead>
                <tbody>
                    { displayItems.map(({id, itemName, itemStock, itemPrice}) => {
                        return (
                            <tr key={`stock-item-${id}`}>
                                <td>{ id }</td>
                                <td>{ itemName }</td>
                                <td>{ itemStock }</td>
                                <td>{ itemPrice }</td>
                            </tr>
                        )
                    }) }
                </tbody>
            </table>
        </div>
    );
}

export default StockTable;