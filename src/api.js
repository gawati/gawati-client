import querystring from 'querystring';
import {dataProxyServer} from './constants';

const GAWATI_CLIENT_APIS = {
    base_iri : '/gw/client',
    apis : {
        'docs': 'docs.json',
        'document-add': '/document/add/',
        'document-open': '/document/load/'
    }
};

export function apiUrl(apiName) {
    if (GAWATI_CLIENT_APIS.apis.hasOwnProperty(apiName)) {
        return dataProxyServer() + GAWATI_CLIENT_APIS.base_iri + GAWATI_CLIENT_APIS.apis[apiName] ;
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

