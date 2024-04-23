import { deleteByID, getAll, insert } from "../indexedDB";
import { IDB_STOCK_ITEM, IDB_STOCK_OPERATOR, OPERATOR_STATUS_NORMAL } from "../settings/types";

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

export async function getOperators() {
    const operators = await getAll(IDB_STOCK_OPERATOR);
    return operators.map(operator => {
        return { id: operator.id, name: operator.operatorName, removable: true }
    })
}

export async function addOperator(operator_name) {
    return await insert(IDB_STOCK_OPERATOR, 
        { 
            operatorName: operator_name, 
            operatorStatus: OPERATOR_STATUS_NORMAL 
        }
    );
}

export async function removeOperator(operator_id) {
    return await deleteByID(IDB_STOCK_OPERATOR, operator_id);
}