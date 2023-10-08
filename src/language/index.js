import { useEffect, useState } from "react";
import { LANGUAGE_EN as DEFAULT_LANGUAGE } from "../settings/types";
import en from "./en";
import cn from "./cn";

const available_languages = {
    en, cn
}

const languageHandler = {
    get: function(target, prop) {
        return target[prop] || prop;
    }
}

function genLangPack() {
    return new Proxy(available_languages[currLanguage], languageHandler);
}

let currLanguage = DEFAULT_LANGUAGE;
let languagePack = genLangPack();
let components = [];

function useLanguage() {
    
    const setLanguageState = useState(currLanguage)[1];

    useEffect(()=>{
        // register component
        components.push(setLanguageState);
        // clean up
        return ()=>{
            components = components.filter(e=>e!==setLanguageState);
        }

    }, [setLanguageState])

    function setLanguage(lang) {
        currLanguage = lang;
        languagePack = genLangPack();
        components.forEach(e=>e(currLanguage));
    }

    return {languagePack, setLanguage, currLanguage};
}

export default useLanguage;