import React from 'react';
import RRNavLink from '../utils/RRNavLink';
import {T} from '../../utils/i18nHelper';
import { getRouteObject, setInRouteObject} from '../../utils/RoutesHelper';

export const NavLinkForTopBar = (props) => {
    const {lang, routeName} = props;
    const routeObj = getRouteObject(routeName);
    const routeTo = setInRouteObject(routeObj, {'lang': lang});
    const routeLabel = routeObj.label;
    return (
    <RRNavLink to={ routeTo }>
        { T(routeLabel) }
    </RRNavLink>
    );
};

