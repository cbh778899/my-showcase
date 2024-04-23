import { getAll, insert } from "../indexedDB";
import { IDB_STOCK_ITEM } from "../settings/types";

export async function getCurrentStock() {
    return await getAll(IDB_STOCK_ITEM)
}

export async function addItem(itemName, itemPrice, itemStock, operatorID, price = null) {
    const stock_id = insert(IDB_STOCK_ITEM, { itemName, itemPrice, itemStock })
    if(stock_id) {
        addStockHistory(
            stock_id,
            Date.now(),
            itemStock,
            price === null ? -itemStock*itemPrice : price,
            operatorID
        );
        return true;
    }
    return false;
}

export function editStock(itemID, stockChanged, operatorID, totalPrice = null) {

}

export function rmItem(itemID) {

}

function addStockHistory(itemID, time, stockChange, price, operatorID) {

}