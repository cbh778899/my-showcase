import { DIGITS_AND_LETTERS } from "../settings/types";

export function generateVerificationCode() {
    return [...Array(4)].map(()=>Math.floor(Math.random() * 10)).join``
}

export function generateID() {
    return [...Array(10)].map(()=>{
        return DIGITS_AND_LETTERS[Math.floor(Math.random() * DIGITS_AND_LETTERS.length)]
    }).join``;
}