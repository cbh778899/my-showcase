export function generateRandomStr(len = 10) {
    let str = ''
    do {
        const randomStr = Math.random().toString(36).slice(2);
        str += randomStr.slice(0, Math.min(len - str.length, randomStr.length))
    } while(str.length < len)
    
    return str;
}

export function generateVerificationCode() {
    return [...Array(4)].map(()=>Math.floor(Math.random() * 10)).join``
}

export function generateID() {
    return generateRandomStr();
}