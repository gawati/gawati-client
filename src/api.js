import querystring from 'querystring';
import {dataProxyServer} from './constants';

/**
 * Use `data` for data APIs
 * Use `local` for file requests on the same current domain
 */
const GAWATI_CLIENT_APIS = [
    {
        name: "data",
        apis : {
            'documents': '/gwc/documents',
            'documents-filter':'/gwc/documents/filter',
            'document-delete':'/gwc/document/delete',
            'document-add': '/gwc/document/add',
            'document-open': '/gwc/document/load',
            'document-edit': '/gwc/document/edit',
            'document-auth': '/gwc/document/auth',
            'document-exists': '/gwc/document/exists',
            'attachment-upload': '/gwc/attachments/upload',
            'attachment-remove': '/gwc/attachments/remove',
            'workflows-meta': '/gwc/workflows/meta',
            'workflows-transit': '/gwc/workflows/transit',
            'workflows-defaults': '/gwc/workflows/defaults',
            'keycloak': '/gwc/auth/config',
            'config': '/gwc/config'
        }
    },
    {
        name: "local",
        apis: {}
    }
]

/**
 * Get the data apis
 */
const getDataApis = () =>
    GAWATI_CLIENT_APIS.filter( (item) => item.name === "data" )[0];

/**
 * Get the local apis
 */
const getLocalApis = () =>
    GAWATI_CLIENT_APIS.filter( (item) => item.name === "local" )[0];

/**
 * Use this for Data APIs
 * @param {*} apiName
 */
export function apiUrl(apiName) {
    const dataApis = getDataApis().apis;
    if (dataApis.hasOwnProperty(apiName)) {
        return dataProxyServer() + dataApis[apiName] ;
    } else {
        console.log(" Unknown API call ", apiName);
        return false;
    }
}

/**
 * Use this for local file Requests on the current domain
 * @param {*} apiName
 */
export function apiLocalUrl(apiName) {
    const localApis = getLocalApis().apis;
    if (localApis.hasOwnProperty(apiName)) {
        return localApis[apiName] ;
    } else {
        console.log(" Unknown Local API call ", apiName);
        return false;
    }
};

/**
 * Just a more standardized wrapper on apiLocalUrl
 * @param {*} apiName
 */
export const apiLocalGetCall = (apiName) =>
    apiLocalUrl(apiName) ;

/**
 * Use this for Data APIs
 * @param {*} apiName
 * @param {*} objParams
 */
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

