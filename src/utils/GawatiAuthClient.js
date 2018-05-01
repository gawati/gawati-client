import Keycloak from 'keycloak-js';
import axios from 'axios';

/**
 * Gets the GAWATI_AUTH window object
 */
const getGawatiAuth = () => {
    return window.GAWATI_AUTH ; 
};

const getGawatiAuthConfig = () => {
    return window.GAWATI_AUTH_CONFIG;
};

/**
 * Sets up the KeyCloak object into the global window object
 * using the KeyCloak json document
 */
export const setup = (keycloakURL) => {
  if (window.GAWATI_AUTH === undefined) {
    return axios.get(keycloakURL).then(response => {
        window.GAWATI_AUTH_CONFIG = response.data;
        window.GAWATI_AUTH = Keycloak(response.data);
    });
  } else {;
    return Promise.resolve(true);
  }
}

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
const getTokenParsed = () => {
    return getGawatiAuth().tokenParsed ; 
};

/**
 * Returns applicable roles for a client
 * @param {*} client name of client
 * @returns array of roles 
 */
export const getRolesForClient = (client) => {
    let roles = [];
    const token = getTokenParsed();
    if (token.resource_access) {
        if (token.resource_access[client]) {
            roles = token.resource_access[client].roles;
        }
    }
    if (token.realm_access) {
        roles = roles.concat(token.realm_access.roles);
    }
    return roles;
};

export const getRolesForCurrentClient = () => {
    const client = getCurrentClient();
    return getRolesForClient(client);
};

/**
 *  Returns the current active client / resource being setup
 */
export const getCurrentClient = () => {
    const authConfig = getGawatiAuthConfig();
    if (authConfig.clientId) {
        return authConfig.clientId;
    } else 
    if (authConfig.resource) {
        return authConfig.resource;
    } else {
        return "";
    }
};

/**
 * Generates the bearer token
 * @param {*} token 
 */
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
 * Updates the Access Token using the Refresh Token, every
 * ``minValidity`` seconds.
 * @param {integer} minValidity in seconds
 */
export const refreshToken = (minValidity = 5) => {
    return new Promise((resolve, reject) => {
        getGawatiAuth().updateToken(minValidity)
            .success(() => resolve())
            .error((err) => reject(err));
    });
};
