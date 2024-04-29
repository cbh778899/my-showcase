import React, { useEffect, useRef, useState } from 'react';
import '../../styles/stock/stock_table.css';
import usePopup from '../../popup';
import PopupWindow from '../popup';

function StockTable({stock, languagePack}) {

    const [itemsEachPage, setItemsEachPage] = useState(15)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(0);
    const [displayItems, setDisplayItems] = useState([]);

    const changeItemsEachPageController = usePopup();

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

    function checkDisplayAvailability(target) {
        const items_each_page = +target.value;
        if(isNaN(items_each_page)) {
            target.classList.add('content-invalid')
            return false;
        } else {
            target.classList.remove('content-invalid')
            return true;
        }
    }

    function submitChangeItemsEachPage(evt) {
        evt.preventDefault();

        const input = evt.target['items-each-page'];
        const value = input.value;
        if(!checkDisplayAvailability(input)) return;
        else {
            setItemsEachPage(+value);
            changeItemsEachPageController.close();
        }
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
        updateDisplayItems();
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
                        <>
                        <span>{`${languagePack['Displaying Stock']} ${currentPage*itemsEachPage+1}-${Math.min((currentPage+1)*itemsEachPage, stock.length)}`}</span>
                        <span onClick={changeItemsEachPageController.showModal}>{ languagePack['change-stock-each-page'] }</span>
                        </>:
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
                    <tr className='title'>
                        <th scope='col'>{languagePack['Item ID']}</th>
                        <th scope='col'>{languagePack['Item Name']}</th>
                        <th scope='col'>{languagePack['Unit Price']}</th>
                        <th scope='col'>{languagePack['Item Stock']}</th>
                    </tr>
                </thead>
                <tbody>
                    { displayItems.map(({id, itemName, itemStock, itemPrice}) => {
                        return (
                            <tr key={`stock-item-${id}`}>
                                <td>{ id }</td>
                                <td>{ itemName }</td>
                                <td>{ itemPrice }</td>
                                <td>{ itemStock }</td>
                            </tr>
                        )
                    }) }
                </tbody>
            </table>
            <PopupWindow controller={changeItemsEachPageController}>
                <form className='styled-popup-content' onSubmit={submitChangeItemsEachPage}>
                    <div className='input-block'>
                        <div className='title'>{ languagePack['ask-items-each-page'] }</div>
                        <input 
                            defaultValue={itemsEachPage}
                            className='input-type' type='text' 
                            name='items-each-page' onInput={evt=>checkDisplayAvailability(evt.target)}
                        />
                    </div>
                    <button className='popup-btn blue-btn clickable' type='submit'>
                        { languagePack['Submit'] }
                    </button>
                    <div className='popup-btn clickable' onClick={changeItemsEachPageController.close}>
                        { languagePack['Cancel'] }
                    </div>
                </form>
            </PopupWindow>
        </div>
    );
}

export default StockTable;