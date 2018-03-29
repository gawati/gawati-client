import Keycloak from 'keycloak-js';

import GAWATI_AUTH from './GawatiAuthService';

export const setup = (authJson) => {
    let keycloak = Keycloak(authJson);
    GAWATI_AUTH = keycloak;
};

export const initLoginRequired = (onSuccess, onError) => {
    GAWATI_AUTH.init(
        {onLoad: 'login-required'}
    ).success( (authenticated) => {
        if (authenticated) {
            onSuccess();
        }
    }).error( (err) => {
        onError(err);
    });
};

export const refreshToken = (minValidity = 5) => {
    return new Promise((resolve, reject) => {
        GAWATI_AUTH.updateToken(minValidity)
            .success(() => resolve())
            .error((err) => reject(err));
    });
};
