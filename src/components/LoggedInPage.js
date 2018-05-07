import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import FooterNav from './ui_elements/FooterNav';
//import Aside from './Aside';
import TopNav from './ui_elements/TopNav';
import SideBar from './sidebar/SideBar';
import Dashboard from '../views/Dashboard';
//import Login from '../views/pages/Login/Login';
import DocumentForm from '../views/forms/DocumentForm';

import {PropsRoute, getRoute} from '../utils/RoutesHelper';
import { ToastContainer } from 'react-toastify';


export const LoggedInPage = ({i18n}) => (
    <div className="app">
        <PropsRoute path="*" component={ TopNav } i18n={ i18n } />
        <div className="app-body">
        <PropsRoute path="*" component={SideBar} i18n={i18n} />
        { /*
        <main className="main">
            <PropsRoute path="/:path" component={Breadcrumbs} {...this.props} />
            <Container fluid> 
        */ }
            <Switch>

                <Route exact path="/dashboard" >
                    <Redirect to="/_lang/en/dashboard" />
                </Route>

                <PropsRoute path={ getRoute("logged-in-root") } name="Dashboard" component={Dashboard} i18n={i18n} />

                <PropsRoute path={ getRoute("document-ident-edit") }
                    name="EditForm" component={DocumentForm} mode="edit" i18n={i18n} />

                <PropsRoute path={ getRoute("document-add") } 
                    name="InputForm" component={DocumentForm} mode="add" i18n={i18n} />

                <Redirect from="/" to="/dashboard"/>

            </Switch>
       {/*  </Container> */}
        {/* </main> */}
        {/*<Aside />*/}
        </div>
        <PropsRoute path="*" component={ FooterNav } i18n={ i18n } />
        <ToastContainer />
    </div>
);