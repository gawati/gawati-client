import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import {  Container } from 'reactstrap';

import FooterNav from './FooterNav';
//import Aside from './Aside';
import TopNav from './TopNav';
import SideBar from './sidebar/SideBar';
import Breadcrumb from './Breadcrumb';
import Dashboard from '../views/Dashboard';
//import Login from '../views/pages/Login/Login';
import EditForm from '../views/forms/EditForm';

import {PropsRoute} from '../utils/routeshelper';
import { ToastContainer } from 'react-toastify';

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
                            <Route exact path="/dashboard">
                                <Redirect to="/dashboard/_lang/en" />
                            </Route>
                            <PropsRoute path="/dashboard/_lang/:lang" name="Dashboard" component={Dashboard} i18n={i18n} />
                            <PropsRoute path="/document/open/ident/_lang/:lang/_iri/:iri*" 
                                name="EditForm" component={EditForm} mode="edit" i18n={i18n} />
                            <PropsRoute path="/document/add/_lang/:lang" 
                                name="InputForm" component={EditForm} mode="add" i18n={i18n} />
                            <Redirect from="/" to="/dashboard"/>

                        </Switch>
                     </Container>
                </main>
                {/*<Aside />*/}
            </div>
            <PropsRoute path="*" component={ FooterNav } i18n={ i18n } />
            <ToastContainer />
            </div>
        );
    }
}

export default Root;
