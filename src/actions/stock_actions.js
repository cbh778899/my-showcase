export function getCurrentStock(callback) {
    callback([]);
}

export function addItem({itemName, itemPrice, itemStock}, operatorID, callback) {
    
}

export function editStock(itemID, stockChanged, operatorID, callback, totalPrice = null) {

}

export function rmItem(itemID, callback) {

}

function addStockHistory({itemID, time, stockChange, price, operatorID}) {

}