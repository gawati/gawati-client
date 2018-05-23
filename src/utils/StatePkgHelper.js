/**
 *  Helper for state pkg in DocumentForm
 *  NOT FOR USE WITH DASHBOARD LISTINGS !
 */



export const docNumber = (pkg) => {
    return pkg.pkgIdentity.docNumber.value ; 
};

export const docIri = (pkg) => {
    return pkg.pkgIdentity.docIri.value ; 
};

export const docType = (pkg) => {
    return pkg.pkgIdentity.docType.value;
};

export const docAknType = (pkg) => {
    return pkg.pkgIdentity.docAknType.value ; 
};


export const docWorkflowState = (pkg) => {
    return pkg.workflow.state ? pkg.workflow.state : '';
};

export const docTitle = (pkg) => {
    return pkg.pkgIdentity.docTitle.value ; 
};


export const docWorkflowTransitions = (pkg) => {
    return pkg.workflow.transitionsFromState || [];
};

export const docWorkflowCurrentState = (pkg) => {
    return pkg.workflow.state;
};

export const docWorkflowStateInfo = (pkg, stateName) => {
    const wfStateInfo = pkg.workflow.allStates.filter( (wfState) => wfState.name === stateName );
    return wfStateInfo;
};

export const docCreatedDate = (pkg) => {
    return pkg.pkgIdentity.docCreatedDate.value;
};

export const docModifiedDate = (pkg) => {
    return pkg.pkgIdentity.docModifiedDate.value;
};

export const docOfficialDate = (pkg) => {
    return pkg.pkgIdentity.docOfficialDate.value;
};

export const statePermissions = (pkg) => {
    return pkg.permissions.permission;
};
