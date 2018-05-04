import {permissions} from "./PkgHelper.js";

export const PERMISSIONS = {
    "VIEW": "view",
    "EDIT": "edit",
    "DELETE": "delete",
    "TRANSIT": "transit",
    "LIST": "list"
};

export const hasViewPermission = (pkg, roles) => {
    return __hasPermission(pkg, roles, PERMISSIONS.VIEW);
};

export const hasTransitPermission = (pkg, roles) => {
    return __hasPermission(pkg, roles, PERMISSIONS.TRANSIT);
};

export const hasListPermission = (pkg, roles) => {
    return __hasPermission(pkg, roles, PERMISSIONS.LIST);
};

export const hasEditPermission = (pkg, roles) => {
    return __hasPermission(pkg, roles, PERMISSIONS.EDIT);
};

export const hasDeletePermission = (pkg, roles) => {
    return __hasPermission(pkg, roles, PERMISSIONS.DELETE);
};


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
export const __hasPermission = (pkg, roles, permissionName) => {
    const permMap = permissions(pkg).filter( (item) => item.name === permissionName );
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

