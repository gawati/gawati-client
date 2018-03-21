import querystring from 'querystring';
import {dataProxyServer} from './constants';

const GAWATI_CLIENT_APIS = {
    apis : {
        'documents': '/gwdc/documents',
        'document-add': '/gwdc/document/add',
        'document-open': '/gwdc/document/load',
        'document-edit': '/gwdc/document/edit',
        'document-upload': '/gwc/document/upload'
    }
};

export function apiUrl(apiName) {
    if (GAWATI_CLIENT_APIS.apis.hasOwnProperty(apiName)) {
        return dataProxyServer() + GAWATI_CLIENT_APIS.apis[apiName] ;
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

