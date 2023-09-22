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