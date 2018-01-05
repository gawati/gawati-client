import routeConfigs from '../configs/routes.json';

import React from 'react';
import { Route } from 'react-router-dom';
/**
 * This is the default Route
 */
export const defaultRoute = () => (
    {
        name: "404",
        route: "/404"
    }
);

/**
 * Gets the route configuration for a specific route
 * @param {string} routeName 
 */
export const getRoute = (routeName) => {
    let routeConfig = routeConfigs.routes.find( route => route.name === routeName) ;
    if (routeConfig === undefined) {
        return defaultRoute();
    } else {
        return routeConfig.route;
    }
};

/**
 * Sets values in a route based on the provided map and produces a link
 * e.g. for the route
 * /search/_lang/:lang/_count/:count/_from/:from/_to/:to/_bycountry/:country
 * an object with {lang:..., count:..., from:..., }
 * will set those parameters in route and produce a link
 * @param {string} routeName 
 * @param {object} params 
 */
export const setInRoute = (routeName, params) => {
    let route = getRoute(routeName);
    let routeArr = route.split("/");
    let updatedRouteArr = routeArr.map( part => {
        if (part.startsWith(":")) {
            let partName = part.replace(":", "").replace("*", "");
            return params[partName]
        } else {
            return part;
        }
    });
    return updatedRouteArr.join("/");
};


export const convertObjectToEncodedString = (obj) => encodeURIComponent(JSON.stringify(obj)) ;
    
export const convertEncodedStringToObject = (aString) => JSON.parse(decodeURIComponent(aString)) ;

const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);
    console.log(" MERGED PROPS ", finalProps);
    return (
      React.createElement(component, finalProps)
    );
};
  
export const PropsRoute = ({ component, ...rest }) => {
    return (
      <Route {...rest} render={routeProps => {
        return renderMergedProps(component, routeProps, rest);
      }}/>
    );
};