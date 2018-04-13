import Keycloak from 'keycloak-js';

/**
 * Sets the KeyCloak JSON Object into the global window object
 * @param {object} KeyCloak json object for the client 
 */
const setGawatiAuth = (obj) => {
    window.GAWATI_AUTH = obj;
}

/**
 * Gets the GAWATI_AUTH window object
 */
const getGawatiAuth = () => {
    return window.GAWATI_AUTH ; 
};

/**
 * Sets up the KeyCloak object using the KeyCloak json document
 * @param {object} authJson 
 */
export const setup = (authJson) => {
    let keycloak = Keycloak(authJson);
    setGawatiAuth(keycloak);
};

/**
 * Initializes the login for the KeyCloak object
 * @param {*} onSuccess success callback
 * @param {*} onError  error callback
 */
export const initLoginRequired = (onSuccess, onError) => {
    getGawatiAuth().init(
        {onLoad: 'login-required'}
    ).success( (authenticated) => {
        if (authenticated) {
            onSuccess();
        }
    }).error( (err) => {
        onError(err);
    });
};

/**
 * Returns the authorization token
 */
export const getToken = () => {
    return getGawatiAuth().token;
};

/**
 * Returns the parsed authorization token
 */
export const getTokenParsed = () => {
    return getGawatiAuth().tokenParsed ; 
}

export const generateBearerToken = (token) => { 
    return {Authorization: `Bearer ${token}` , 'Content-Type': 'application/json' };
};

/**
 * Logs out
 */
export const siteLogout = () => {
    return getGawatiAuth().logout();
};

/**
 * Refreshes the token every ``minValidity`` seconds
 * @param {integer} minValidity in seconds
 */
export const refreshToken = (minValidity = 5) => {
    return new Promise((resolve, reject) => {
        getGawatiAuth().updateToken(minValidity)
            .success(() => resolve())
            .error((err) => reject(err));
    });
};
