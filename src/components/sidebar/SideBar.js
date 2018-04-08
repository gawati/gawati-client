import React from 'react';
import {NavLink} from 'react-router-dom';
import {Badge, Nav, NavItem, NavLink as RsNavLink} from 'reactstrap';
import classNames from 'classnames';
import {getSideNavItems} from './navItemsStructure';
import SideBarFooter from './SideBarFooter';
import SideBarForm from './SideBarForm';
import SideBarHeader from './SideBarHeader';
import SideBarMinimizer from './SideBarMinimizer';

class SideBar extends React.Component {

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName, props) {
    // return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
    return props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';

  }

  // todo SideBar nav secondLevel
  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }


    // badge addon to NavItem
   SidebarNavItemBadge = (badge) => {
      if (badge) {
        const classes = classNames( badge.class );
        return (<Badge className={ classes } color={ badge.variant }>{ badge.text }</Badge>)
      } else {
        return null;
      }
  };

    // simple wrapper for nav-title item
    NavTitleItemWrapper = item => { return (item.wrapper && item.wrapper.element ? (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)): item.name ) };

    // nav list section title
    NavListSectionTitle =  (title, key) => {
      const classes = classNames( 'nav-title', title.class);
      return (<li key={key} className={ classes }>{this.NavTitleItemWrapper(title)} </li>);
    };

    // nav list divider
    NavListDivider = (divider, key) => {
      const classes = classNames( 'divider', divider.class);
      return (<li key={key} className={ classes }></li>);
    };

    // nav item with nav link
    NavItemWithNavLink = (item, key) => {
      const classes = {
        item: classNames( item.class) ,
        link: classNames( 'nav-link', item.variant ? `nav-link-${item.variant}` : ''),
        icon: classNames( item.icon )
      };
      return (
        this.ComplexNavLink(item, key, classes)
      )
    };

    // nav link
    ComplexNavLink = (item, key, classes) => {
      const url = item.url ? item.url : '';
      return (
        <NavItem key={key} className={classes.item}>
          { this.isExternal(url) ?
            <RsNavLink href={url} className={classes.link} active>
              <i className={classes.icon}></i>{item.label}{this.SidebarNavItemBadge(item.badge)}
            </RsNavLink>
            :
            <NavLink to={url} className={classes.link} activeClassName="active">
              <i className={classes.icon}></i>{item.label}{this.SidebarNavItemBadge(item.badge)}
            </NavLink>
          }
        </NavItem>
      )
    };

    // nav dropdown
    NavDropDown = (item, key) => {
      return (
        <li key={key} className={this.activeRoute(item.url, this.props)}>
          <a className={ `nav-link nav-dropdown-toggle` } 
            onClick={this.handleClick.bind(this)}>
            <i className={item.icon}></i>{item.name}
          </a>
          <ul className="nav-dropdown-items">
            {this.NavList(item.children)}
          </ul>
        </li>)
    };

    // nav type
    NavType = (item, idx) =>
      item.title ? this.NavListSectionTitle(item, idx) :
      item.divider ? this.NavListDivider(item, idx) :
      item.children ? this.NavDropDown(item, idx)
                    : this.NavItemWithNavLink(item, idx) ;

    // nav list
    NavList = (items) => {
      return items.map( (item, index) => this.NavType(item, index) );
    };

    isExternal = (url) => {
      const link = url ? url.substring(0, 4) : '';
      return link === 'http';
    };




  render() {
    console.log(" PROPS MATCH ", this.props);
    const lang = this.props.match.params.lang || "en";

    // sidebar-nav root
    return (
      <div className="sidebar">
        <SideBarHeader/>
        <SideBarForm/>
        <nav className="sidebar-nav">
          <Nav>
            {this.NavList(getSideNavItems(lang))}
          </Nav>
        </nav>
        <SideBarFooter/>
        <SideBarMinimizer/>
      </div>
    )
  }
}

export default SideBar;
