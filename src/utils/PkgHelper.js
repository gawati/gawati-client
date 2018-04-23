import React from 'react';

export const docNumber = (pkg) => {
    return pkg.pkgIdentity.docNumber.value ; 
};

export const docWorkflowState = (pkg) => {
    console.log(" docWorkflowState = ", pkg);
    return pkg.workflow.state ? pkg.workflow.state : '';
};