import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import {  Container } from 'reactstrap';

import FooterNav from './FooterNav';
//import Aside from './Aside';
import TopNav from './TopNav';
import SideBar from './sidebar/SideBar';
import Breadcrumb from './Breadcrumb';
import Dashboard from '../views/Dashboard';
//import Login from '../views/pages/Login/Login';
import InputForm from '../views/forms/InputForm';
import {PropsRoute} from '../utils/routeshelper';


class Root extends React.Component {
    render() {
        const {i18n} = this.props;
        return (
            <div className="app">
                <PropsRoute path="*" component={ TopNav } i18n={ i18n } />
                <div className="app-body">
                <SideBar path="*" {...this.props}/>
                <main className="main">
                    <Breadcrumb />
                    <Container fluid>
                        <Switch>
                            <PropsRoute path="/dashboard" name="Dashboard" component={Dashboard} i18n={i18n} />
                            <PropsRoute path="/document/add" name="InputForm" component={InputForm} i18n={i18n} />
                            <Redirect from="/" to="/dashboard"/>
                        </Switch>
                     </Container>
                </main>
                {/*<Aside />*/}
            </div>
            <PropsRoute path="*" component={ FooterNav } i18n={ i18n } />
            </div>
        );
    }
}

export default Root;
