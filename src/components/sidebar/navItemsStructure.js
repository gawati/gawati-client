import navItems from '../../configs/sidebarNav.json';
import { getRouteObject, setInRouteObject } from '../../utils/RoutesHelper';


export const getSideNavItems = (lang) => {
  let nav = navItems.items;
  return nav.map( (item) => {
    if (item.route) {
      let routeObj = getRouteObject(item.route);
      if (!item.label) {
        item.label = routeObj.label;
      }
      item.url = setInRouteObject(routeObj, {"lang": lang});
      return item;
    } else {
      return item;
    }
  });
};
/* 
export default {
    items: [
      {
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'fa fa-list-alt',
        badge: {
          variant: 'info',
          text: 'NEW'
        }
      }
    ]
  };
   */