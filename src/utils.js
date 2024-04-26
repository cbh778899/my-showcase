function calculateMinDimensions(width, height, maxWidth, maxHeight) {
    const dimensions = {}
    if(width >= height) {
        dimensions.height = maxHeight;
        dimensions.width = maxHeight * (width / height);
    } else {
        dimensions.width = maxWidth;
        dimensions.height = maxWidth * (height / width);
    }
    
    return dimensions;
}

export function calculateDefaultImageScale(width, height, maxWidth, maxHeight) {
    const dimensions = calculateMinDimensions(width, height, maxWidth, maxHeight)
    if(width >= height) {
        dimensions.x = - (dimensions.width - maxWidth) / 2;
        dimensions.y = 0;
    } else {
        dimensions.y = - (dimensions.height - maxHeight) / 2;
        dimensions.x = 0;
    }
    
    return dimensions;
}

export function validateMovement(new_x, new_y, width, height, maxWidth, maxHeight) {
    if(new_x > 0) {
        new_x = 0;
    } else if(new_x + width < maxWidth) {
        new_x = maxWidth - width
    }

    if(new_y > 0) {
        new_y = 0;
    } else if(new_y + height < maxHeight) {
        new_y = maxHeight - height
    }

    return {x: new_x, y: new_y}
}

export function validateScale(new_w, new_h, new_x, new_y, maxWidth, maxHeight) {
    let dimensions = 
        (new_w < maxWidth || new_h < maxHeight) ? 
        calculateMinDimensions(new_w, new_h, maxWidth, maxHeight) :
        {width: new_w, height: new_h};
    
    dimensions = {
        ...dimensions,
        ...validateMovement(
            new_x, new_y, 
            dimensions.width, dimensions.height,
            maxWidth, maxHeight)
    }

    return dimensions
}

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

export function getSearchParams(search) {
    const searchParams = {}
    for(const [key, value] of new URLSearchParams(search)) {
        searchParams[key] = value
    }
    return searchParams
}

export function isEmail(str) {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(str)
}

const password_testers = [
    /\d+/g,
    /[a-z]+/g,
    /[A-Z]+/g,
    /[,._!@#$%^&*()[\]\\/?+\-~`<>{}]+/g
]

export function passwordStrength(password) {
    let strength = 0;
    password_testers.forEach(ptn=>{
        if(password.match(ptn)) strength ++;
    })
    return strength;
}

export async function retry(end_retry, lasting_ms, max_retry) {
    if(end_retry()) return true;
    
    while(max_retry --) {
        await new Promise(s=>setTimeout(s, lasting_ms))
        if(end_retry()) return true;
    }
    return false;
}

const AsyncFunc = (async ()=>{}).constructor

export async function multiCondResult(conditions = []) {

    async function runner(func) {
        if(func instanceof AsyncFunc) {
            return await func();
        } else {
            return func();
        }
    }

    for(const cond of conditions) {
        const { condition, isTrue, isFalse } = cond;

        if(typeof condition === 'function' ? await runner(condition) : condition) {
            isTrue && isTrue();
        } else {
            isFalse && isFalse();
            return false;
        }
    }
    return true;
}