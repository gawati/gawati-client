//import {documentTypes} from '../constants';
import docTypes from '../configs/docTypes.json';
import languageCodes from '../configs/shortLanguageCodes.json';

import moment from 'moment';

/**
 * Use this to wrap multiple elements when returning a component from render()
 * e.g. 
 * if you you have to return:
 * 
 * .. code-block::html
 * 
 *      <input /><button />
 * 
 * You can wrap it in <Aux> and return it without being forced to wrap it in a <div>
 * There is no visual or layout impact of <Aux>
 * 
 * @param {*} props 
 */
export const Aux = props => props.children;

/**
 * Shortens a string at the ith character
 * @param {integer} i 
 * @param {string} text 
 */
export const stringCut = (i, text) => {
    var short = text.substr(0, i);
    if (/^\S/.test(text.substr(i)))
        return short.replace(/\s+\S*$/, "");
    return short;
};

/**
 * Returns a shortened string as per gawati shortened requirements
 * @param {string} theTitle 
 */
export const shortTitle = (theTitle) => {
    if (theTitle.length <= 80) {
        return theTitle;
    } else {
        return stringCut(80, theTitle) + "...";
    }
};

/**
 * Prefixes a `/` on a IRI if it isnt present
 * @param {string} iri 
 */
export const prefixIri = (iri) => 
     iri.startsWith('/') ? iri : "/" + iri;

/**
 * Gets the document type of an Akoma Ntoso JSON object
 * @param {object} doc 
 */
export const getDocumentType = (doc) => Object.keys(doc.akomaNtoso)[0] ;

/**
 * Checks if an object is empty
 * @param {object} obj 
 */
export const isEmpty =  (obj) => 
    Object.keys(obj).length === 0 && obj.constructor === Object ;

export const defaultLang = () => ({
    "lang": "eng",
    "langUI": "en",
    "content": "English"
});

export const defaultListCount = () => 10;

export const getDocTypes = () => docTypes.docTypes ;

export const getDocType = (findType) => getDocTypes().find(dType => dType['akn-type'] === findType) ;

export const getLangCodeAlpha3b = (alpha3b) => languageCodes.langs.lang.find(lingo => lingo['alpha3b'] === alpha3b ) ;

export const getLangDesc = (alpha3b) => {
    let langAlpha = getLangCodeAlpha3b(alpha3b);
    if (langAlpha !== undefined) {
        let descArr = coerceIntoArray(langAlpha.desc);
        let langDesc = descArr.find( desc => desc.lang === alpha3b) || descArr.find( desc => desc.lang === "eng");
        return langDesc;
    }
    return defaultLang();
};

export const displayDate = (date) => moment(date).format('MMMM D YYYY') ;

export const range = ((n) => [...Array(n).keys()] ) ;

/**
 * Returns an array of a range of numbers
 * @param {integer} min 
 * @param {integer} max 
 * @param {integer} step 
 */
export const rangeMinMax = ((min, max , step = 1) => {
    // return a array from min to max, inclusive, in steps of step.
    // if step is not integer, then max may not be included
    // http://xahlee.info/js/javascript_range_array.html
    // version 2017-04-20
    const arr = [];
    const totalSteps = Math.floor((max - min)/step);
    for (let ii = 0; ii <= totalSteps; ii++ ) { arr.push(ii * step + min) }
    return arr;
} );

export const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};    

export const roundto100 = (num) => {
    if (num > 99) {
        return Math.floor(num/100) * 100 ;
    } else {
        return num;
    } 
};

export const roundto100Filter = (num) => {
    if (num > 99) {
        return Math.floor(num/100) * 100 + " +" ;
    } else {
        return num;
    } 
};

export const insertIntoArray = (arr, value) => {
        return arr.reduce((result, element, index, array) => {
            result.push(element);
            if (index < array.length - 1) {
                result.push(value);
            }
            return result;
        }, []);
    };

/**
 * Checks if the object is an array, if an array returns it as is, 
 * otherwise coerces it into an array and returns the array.
 * This is used because XML to JSON returns arrays with single items
 * as objects. So we force it an array for such edge cases.
 * @param {object} obj any object 
 */
export const coerceIntoArray = (obj) => 
    Array.isArray(obj) ? obj : [obj] || [];

export const filterMap = (obj, blacklist) => {
    let filteredObject = {};
    let objKeys = new Set(Object.keys(obj));
    blacklist.forEach(item => objKeys.delete(item));
    [...objKeys].forEach(key => filteredObject[key] = obj[key]);
    return filteredObject;
};

export const isInt = (value) =>  {
    var x;
    if (isNaN(value)) {
      return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
};
