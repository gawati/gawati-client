export const docNumber = (pkg) => {
    return pkg.pkgIdentity.docNumber.value ; 
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
    return pkg.created ;
};

export const docModifiedDate = (pkg) => {
    return pkg.modified ;
};


export const docOfficialDate = (pkg) => {
    return pkg.pkgIdentity.docOfficialDate.value;
};