import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
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

import { REFRESH_TOKEN_VALIDITY, REFRESH_TOKEN_INTERVAL } from './constants';
import {setup, initLoginRequired, refreshToken, siteLogout} from './utils/GawatiAuthClient';
import {sanityChecker} from './utils/SanityHelper';
import {apiGetCall} from './api';
//import { T } from './utils/i18nHelper';

const appLoader = () => {
    setup(
        apiGetCall('keycloak', {})
    ).then(() => {

        setInterval(() => {
            refreshToken(REFRESH_TOKEN_VALIDITY)
            .catch(err => {
                alert("The authentication session has expired. Please sign-in again.");
                siteLogout();
            });
        }, REFRESH_TOKEN_INTERVAL);

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
                //alert("There was an error while initializing login");
                siteLogout();
            }
        );
    }).catch((e) => {
        console.log("ERROR retreiving json" , e);
        alert("There was an error while setting up authentication");
    });
};


// Load Editor config from server
axios.get(apiGetCall('config', {}))
.then((response) => {
    window.gawatEditorConfig = response.data;

    // Launch with various Sanity checks
    sanityChecker(appLoader);
})
.catch(err => console.log("Error getting config from server ", err));


// sanityChecker(appLoader);

/*         <Switch>
            <Route path="/register" name="Register" component={Register} />
            <Route path="/login" name="Login" component={Login} />
            <PrivateRoute path="/dashboard" name="App" component={App} />
            <PrivateRoute path="/" name="App" component={App} />
        </Switch>
 */

registerServiceWorker();
