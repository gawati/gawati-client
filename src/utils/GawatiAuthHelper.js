import Keycloak from 'keycloak-js';
import keycloakJson from '../configs/authRealm.json';

export default class GawatiAuthHelper{

    static isUserLoggedIn = function(){
	    return localStorage.getItem('KC_authenticated')==='true';
	}

	static getUserName = function(){
		return localStorage.getItem('KC_username');
	}

	static login = function(){
		const KC = Keycloak(keycloakJson);
	    KC.init();
		KC.login();
	}

	static register = function(){
		const KC = Keycloak(keycloakJson);
	    KC.init();
		KC.register();
	}

	static logout = function(){
		const KC = Keycloak(keycloakJson);
	    KC.init();
	    localStorage.setItem('KC_authenticated', 'false');
	    localStorage.setItem('KC_username', 'guest');
	    KC.logout();
	}

	static save = function(callback){
		const KC = Keycloak(keycloakJson);
	    KC.init().success(function(authenticated) {
            if(authenticated){
            	localStorage.setItem('KC_authenticated', 'true');
                KC.loadUserProfile().success(function(profile) {
                	localStorage.setItem('KC_username', profile.username);
                    callback(true);
                }).error(function() {
                	localStorage.setItem('KC_username', 'guest');
                    callback(false);
                });
            }else{
            	localStorage.setItem('KC_authenticated', 'false');
                localStorage.setItem('KC_username', 'guest');
                callback(false);
            }
        }).error(function(error) {
            alert('failed to initialize'+error);
            callback(false);
        })
	}

	static getToken = function(callback){
		const KC = Keycloak(keycloakJson);
		KC.updateToken(5).success(function(refreshed) {
	        callback(KC.token);
	    }).error(function() {
	        callback(false);
	    });
	}

	static hasRealmRole = function(role){
		const KC = Keycloak(keycloakJson);
		return KC.hasRealmRole(role);
	}

	static hasResourceRole = function(role, resource){
		const KC = Keycloak(keycloakJson);
		return KC.hasResourceRole(role, resource);
	}
}
