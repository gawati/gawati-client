import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './i18n';
import { BrowserRouter } from 'react-router-dom';

//import 'bootstrap/dist/css/bootstrap-reboot.css';
//import 'bootstrap/dist/css/bootstrap.css';
// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
import './css/custom.css';
import './css/custom-media.css';

// Views 
//import Register from './views/pages/Register/Register';
//import Login from './views/pages/Login/Login';

//import {PrivateRoute} from './components/routing/PrivateRoute';

import './globalize';

import {setup, initLoginRequired, siteLogout} from './utils/GawatiAuthClient';
import {sanityChecker, validDocTypesCheck, validWorkflowsCheck} from './utils/SanityHelper';
import {apiGetCall} from './api';
import { T } from './utils/i18nHelper';         

const appLoader = () => {
    setup(
        apiGetCall('keycloak', {})
    ).then(() => {
        initLoginRequired(
            () => {
                ReactDOM.render(
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>,
                    document.getElementById('root')
                );
            },
            (error) => {
                console.log("ERROR initLoginRequired ", "Error while logging in", error );
                alert("There was an error while initializing login");
                siteLogout();
            }
        );
    }).catch((e) => {
        console.log("ERROR retreieing json" , e);
        alert("There was an error while setting up authentication");
    });
};



/** 
 * Launch with various Sanity checks
*/
sanityChecker(appLoader);

/*         <Switch>
            <Route path="/register" name="Register" component={Register} />
            <Route path="/login" name="Login" component={Login} />
            <PrivateRoute path="/dashboard" name="App" component={App} />
            <PrivateRoute path="/" name="App" component={App} />
        </Switch>
 */


registerServiceWorker();
