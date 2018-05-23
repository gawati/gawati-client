/**
 *  Helper for Response processing Dashboard
 *  NOT FOR USE WITH DocumentForm  !
 */



export const docNumber = (pkg) => {
    return pkg.akomaNtoso.docNumber.value ; 
};

export const docIri = (pkg) => {
    return pkg.akomaNtoso.docIri.value ; 
};

export const docType = (pkg) => {
    return pkg.akomaNtoso.docType.value;
};

export const docAknType = (pkg) => {
    return pkg.akomaNtoso.docAknType.value ; 
};


export const docWorkflowState = (pkg) => {
    return pkg.workflow.state ? pkg.workflow.state : '';
};

export const docTitle = (pkg) => {
    return pkg.akomaNtoso.docTitle.value ; 
};



export const serverPermissions = (pkg) => {
    return pkg.permissions.permission;
};
