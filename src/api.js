import querystring from 'querystring';
import {dataProxyServer} from './constants';

const GAWATI_APIS = {
    base_iri : '/',
    apis : {
        'docs': 'docs.json'
    }
};

export function apiUrl(apiName) {
    if (GAWATI_APIS.apis.hasOwnProperty(apiName)) {
        return dataProxyServer() + GAWATI_APIS.base_iri + GAWATI_APIS.apis[apiName] ;
    } else {
        console.log(" Unknown API call ", apiName);
        return false;
    }
}

export function apiGetCall(apiName, objParams) {
    let apiPath = apiUrl(apiName) ;
    if (apiPath !== false) {
        if (Object.keys(objParams).length === 0 && objParams.constructor === Object) {
            return apiPath;
        } else {
            let apiParams =  querystring.stringify(objParams);
            return apiPath + "?" + apiParams;
        }
    }
}

