import { getAll, insert } from "../indexedDB";
import { IDB_STOCK_ITEM } from "../settings/types";

export function getCurrentStock(callback) {
    getAll(IDB_STOCK_ITEM, callback)
}

export function addItem(itemName, itemPrice, itemStock, operatorID, callback, price = null) {
    insert(IDB_STOCK_ITEM, {
        itemName, itemPrice, itemStock
    }, result => {
        if(result) {
            addStockHistory(
                result,
                Date.now(),
                itemStock,
                price === null ? -itemStock*itemPrice : price,
                operatorID
            );
            callback(true);
        } else callback(false)
    })
}

export function editStock(itemID, stockChanged, operatorID, callback, totalPrice = null) {

}

export function rmItem(itemID, callback) {

}

function addStockHistory(itemID, time, stockChange, price, operatorID) {

}