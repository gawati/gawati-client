import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './i18n';
import { Switch, Route, HashRouter } from 'react-router-dom';

//import 'bootstrap/dist/css/bootstrap-reboot.css';
//import 'bootstrap/dist/css/bootstrap.css';
// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';


//import './css/custom.css';
//import './css/custom-media.css';

// Views 
import Register from './views/pages/Register/Register';
import Login from './views/pages/Login/Login';

import './globalize';

ReactDOM.render(
    <HashRouter>
        <Switch>
            <Route path="/register" name="Register" component={Register} />
            <Route path="/login" name="Login" component={Login} />
            <Route path="/dashboard" name="App" component={App} />
            <Route path="/" name="App" component={App} />
        </Switch>
    </HashRouter>, 
    document.getElementById('root')
);

registerServiceWorker();
