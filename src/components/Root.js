import React from 'react';


//import Login from '../views/pages/Login/Login';

import { LoggedInPage } from './LoggedInPage';
import {t} from 'i18next';

class Root extends React.Component {

    render() {
        const {i18n} = this.props;
        console.log(" TEAISEQUAL ", t("ET.Dashboard.Column.State"));
        // check if logged in , if logged in show logged in page otherwise show 
        return (
            <LoggedInPage i18n={i18n} />
        );
    }
}

export default Root;
