import { deleteByID, getAll, insert } from "../indexedDB";
import { IDB_STOCK_HISTORY, IDB_STOCK_ITEM, IDB_STOCK_OPERATOR, OPERATOR_STATUS_INIT_PASSWORD, OPERATOR_STATUS_NORMAL } from "../settings/types";
import { generateRandomStr } from "../utils";

export async function getCurrentStock() {
    return await getAll(IDB_STOCK_ITEM)
}

export async function addItem(itemName, itemPrice, itemStock, operatorID, price = null) {
    const stock_id = await insert(IDB_STOCK_ITEM, { itemName, itemPrice, itemStock })
    if(stock_id) {
        await addStockHistory(
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

async function addStockHistory(itemID, time, stockChange, price, operatorID) {
    await insert(IDB_STOCK_HISTORY, {
        itemID, time, stockChange, price, operatorID
    });
}

export async function getOperators() {
    const operators = await getAll(IDB_STOCK_OPERATOR);
    return operators.map(operator => {
        return { id: operator.id, name: operator.operatorName, removable: true }
    })
}

export async function addOperator(operatorName, password = null) {
    const operatorStatus = password ? OPERATOR_STATUS_NORMAL : OPERATOR_STATUS_INIT_PASSWORD;
    const operatorPassword = password || generateRandomStr(8);
    if(await insert(IDB_STOCK_OPERATOR, 
        { operatorName, operatorStatus, operatorPassword }
    )) {
        return operatorPassword;
    } else return null;
}

export async function removeOperator(operator_id) {
    return await deleteByID(IDB_STOCK_OPERATOR, operator_id);
}