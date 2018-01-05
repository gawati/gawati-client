import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './i18n';
import { HashRouter } from 'react-router-dom';

//import 'bootstrap/dist/css/bootstrap-reboot.css';
//import 'bootstrap/dist/css/bootstrap.css';
// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';


import './css/custom.css';
//import './css/custom-media.css';


ReactDOM.render(
    <HashRouter>
        <App />
    </HashRouter>, 
    document.getElementById('root')
);

registerServiceWorker();
