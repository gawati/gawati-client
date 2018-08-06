import React from 'react';

import {
  Nav,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Badge
  } from 'reactstrap';
  import axios from 'axios';
  import GwSpinner from '../../views/utils/GwSpinner';  

import TopNavDropdown from './TopNavDropdown';

import { NavLinkForTopBar } from './NavElements';

class TopNav extends React.Component {

  constructor () {
    super();
    this.state = {
      loading: false
    }
    const THIS = this;
    axios.interceptors.request.use((config) => {
      THIS.setState ({loading: true});
      return config;
    }, function (error) {
      THIS.setState ({loading: false});
      return Promise.reject(error);
    });
    
    axios.interceptors.response.use( (config) => {
     THIS.setState ({loading: false});
      return config;
    }, function (error) {
      THIS.setState ({loading: false});
      return Promise.reject(error);
    });
  }

    sidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-hidden');
      }
    
      sidebarMinimize(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-minimized');
      }
    
      mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-mobile-show');
      }
    
      asideToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('aside-menu-hidden');
      }

  render() {
    const lang = this.props.match.params.lang || "en" ; 
    const loading = this.state.loading;
    return (
      <header className="app-header navbar">
{/*         <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
<span className="navbar-toggler-icon"></span>
</NavbarToggler>
<NavbarBrand href="#"></NavbarBrand>
<NavbarToggler className="d-md-down-none mr-auto" onClick={this.sidebarToggle}>
<span className="navbar-toggler-icon"></span>
</NavbarToggler>
<NavbarToggler className="d-md-down-none" onClick={this.asideToggle}>
<span className="navbar-toggler-icon"></span>
</NavbarToggler> */}
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        <NavbarBrand href="#"></NavbarBrand>
        <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLinkForTopBar lang={lang} routeName="logged-in-root" />
         </NavItem>
{/*           <NavItem className="px-3">
<NavLink href="#">Users</NavLink>
</NavItem>
<NavItem className="px-3">
<NavLink href="#">Settings</NavLink>
</NavItem>
*/}    </Nav>
{loading? <GwSpinner /> : '' }
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          <TopNavDropdown/>
        </Nav>
{/*         <NavbarToggler className="d-md-down-none" onClick={this.asideToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>    */}     
      </header>
    );
  }
}

export default TopNav;