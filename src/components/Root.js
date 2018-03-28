import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import {  Container } from 'reactstrap';
import { instanceOf } from 'prop-types';
import cookie from 'react-cookie';
import { withCookies, Cookies } from 'react-cookie';

import FooterNav from './ui_elements/FooterNav';
//import Aside from './Aside';
import TopNav from './ui_elements/TopNav';
import SideBar from './sidebar/SideBar';
import Breadcrumb from './ui_elements/Breadcrumb';
import Dashboard from '../views/Dashboard';
//import Login from '../views/pages/Login/Login';
import EditForm from '../views/forms/EditForm';

import {PropsRoute, getRoute} from '../utils/RoutesHelper';
import { ToastContainer } from 'react-toastify';
import { LoggedInPage } from './LoggedInPage';
import Login from '../views/pages/Login/Login';

import GawatiAuthHelper from '../utils/GawatiAuthHelper';

class Root extends React.Component {

      static propTypes = {
        cookies: instanceOf(Cookies).isRequired
      };

    constructor(props) {
        super(props);
        this.state =  { 
            loggedIn: false
        }
        this.updatedLoggedInState = this.updatedLoggedInState.bind(this);
    }

    updatedLoggedInState = (loggedIn) => {
        const {cookies} =  this.props;
        cookies.set('loggedIn', loggedIn);
        console.log( "updatedLoggedInState" , loggedIn, cookies.getAll());
        this.setState({loggedIn: loggedIn});
    }

    checkLogin = () =>{
        const { cookies } = this.props;
        const isLoggedIn = cookies.get('loggedIn')  ;
        if (isLoggedIn == null ) {
            return false;
        } else {
            return (isLoggedIn == 'true');
        }
    }

    componentDidMount() {
        this.state = {
            loggedIn: this.checkLogin()
        };
    }

    render() {
        const {i18n, cookies} = this.props;
        // check if logged in , if logged in show logged in page otherwise show 
        console.log(" ROOT CHECKLOGIN ", cookies.getAll(), cookies.get('loggedIn'), this.checkLogin());
        return (
            this.checkLogin() ? <LoggedInPage i18n={i18n} /> : <Login login={this.updatedLoggedInState} />
        );
    }
}

export default withCookies(Root);
