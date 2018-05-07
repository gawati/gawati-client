import {serverPermissions} from "./ServerPkgHelper.js";

export const PERMISSIONS = {
    "VIEW": {name: "view", label: "Action.View"},
    "EDIT": {name: "edit", label: "Action.Edit"},
    "DELETE": {name: "delete", label: "Action.Delete"},
    "TRANSIT": {name: "transit", label: "Action.Transit"},
    "LIST": {name: "list", label: "Action.List"}
};

export const hasViewPermission = (pkg, roles) => {
    return hasPermission(pkg, roles, PERMISSIONS.VIEW.name);
};

export const hasTransitPermission = (pkg, roles) => {
    return hasPermission(pkg, roles, PERMISSIONS.TRANSIT.name);
};

export const hasListPermission = (pkg, roles) => {
    return hasPermission(pkg, roles, PERMISSIONS.LIST.name);
};

export const hasEditPermission = (pkg, roles) => {
    return hasPermission(pkg, roles, PERMISSIONS.EDIT.name);
};

export const hasDeletePermission = (pkg, roles) => {
    return hasPermission(pkg, roles, PERMISSIONS.DELETE.name);
};

/**
 * Returns an object view keys as permission names, and values as boolean indicating
 * whether a specific permissions is applicable or not.
 * @param {*} pkg the document package object
 * @param {*} roles Array of string logged in roles from the gawati auth client
 */
export const typicalDashboardPermissions = (pkg, roles) => {
    let typicalDashboardActions = [PERMISSIONS.VIEW, PERMISSIONS.EDIT, PERMISSIONS.DELETE] ;
    // first check if permissions is allowed, then filter for only ones where allowed
    const dashActions = typicalDashboardActions.map( (action) => (
                {name: action.name, status: hasPermission(pkg, roles, action.name), label: action.label}
            )
        );
    return dashActions.filter(
             (action) => action.status
        );
}

/**
 *      "permissions": {"permission": [
            {
                "name": "view",
                "roles": {"role": [
                    {"name": "client.Admin"},
                    {"name": "client.Submitter"}
                ]}
            },
            ... 
        ]
 * @param {*} pkg 
 * @param {*} roles string array with role names
 * @param {*} permissionName 
 */
export const hasPermission = (pkg, roles, permissionName) => {
    const permMap = serverPermissions(pkg).filter( (item) => item.name === permissionName );
    // iterate the roles, if any of them matches the view permission return true.
    if (permMap !== undefined) {
        // the below syntax is an easier way of checking nested obejct validity
        // instead of checking ( if (permMap.roles) {  if (permMaps.roles.role) ... })
        // see http://web.archive.org/web/20161108071447/http://blog.osteele.com/posts/2007/12/cheap-monads/
        const docViewRoles =  ((( permMap[0] || {} ).roles || {}).role);
        const hasView = docViewRoles.some( (namedRole) => roles.indexOf(namedRole.name) >= 0);
        return hasView;
    } else {
        return false;
    }
};

