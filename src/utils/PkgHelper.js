import React from 'react';

export const docNumber = (pkg) => {
    return pkg.pkgIdentity.docNumber.value ; 
};

export const docWorkflowState = (pkg) => {
    console.log(" docWorkflowState = ", pkg);
    return pkg.workflow.state ? pkg.workflow.state : '';
};

export const docTitle = (pkg) => {
    return pkg.pkgIdentity.docTitle.value ; 
};


export const docWorkflowTransitions = (pkg) => {
    return pkg.workflow.transitionsFromState || [];
};

export const docCreatedDate = (pkg) => {
    return pkg.created ;
};

export const docModifiedDate = (pkg) => {
    return pkg.modified ;
};


export const docOfficialDate = (pkg) => {
    return pkg.pkgIdentity.docOfficialDate.value;
};