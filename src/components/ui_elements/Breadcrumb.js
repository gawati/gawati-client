import React from 'react';
import {Route} from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap'; 



/* 
const findRouteName = url => routes[url];
*/


/* const getPaths = (pathname) => {
  const paths = ['/'];
  if (pathname === '/') return paths;
  return pathname.split('/').reduce((prev, curr, index) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  //return paths;
}; */

/* const BreadcrumbsItem = ({...rest, match}) => {
  const routeName = findRouteName(match.url);
  if (routeName) {
    return (
      match.isExact ?
        (
          <BreadcrumbItem active>{routeName}</BreadcrumbItem>
        ) :
        (
          <BreadcrumbItem>
            <Link to={match.url || ''}>
              {routeName}
            </Link>
          </BreadcrumbItem>
        )
    );
  }
  return null;
}; */
 
const Breadcrumbs = ({...rest, location : {pathname}, match}) => {
  //const paths = getPaths(pathname);
  return (
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>  
    </Breadcrumb>
  ); 
};

export default props => (
  <div>
    <Route path="/:path" component={Breadcrumbs} {...props} />
  </div>
);