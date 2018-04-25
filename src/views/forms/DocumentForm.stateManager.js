import { STATE_ACTION_RESET_IDENTITY, STATE_ACTION_IS_SUBMITTING, STATE_ACTION_UNSET_DOCUMENT_LOAD_ERROR, STATE_ACTION_SET_DOCUMENT_LOAD_ERROR, STATE_ACTION_IS_NOT_SUBMITTING, STATE_ACTION_SET_FIELD_VALUE, STATE_ACTION_LOADED_DATA, STATE_ACTION_SET_FIELD_ERROR } from './DocumentForm.constants';
import {identityInitialState} from './DocumentForm.formConfig';
/** STATE HANDLERS  */


const initialState = {
  isSubmitting: false,
  documentLoadError: false,
  pkg: {
    pkgIdentity: identityInitialState(),
    pkgAttachments: [],
    workflow: {}
  }
};

/*
****NOT SURE IF THE BELOW TYPE OF API is required...leaving it for refrence
**** The below creates TRUE clones of sub objects
***
const actionIsSubmitting = (state, isSubmitting) => {
  return  {
    isSubmitting: isSubmitting,
    pkg: {
      ...state.pkg,
      pkgIdentity: __pkgIdentity(state),
      pkgAttachments: __pkgAttachments(state)
    }
  }
};
*/

export const applyActionToState = (THIS, action) => {
  const newState = stateAction(THIS.state, action);
  console.log("APPLY_ACTION_TO_STATE = ", action.type, action);
  console.log("APPLY_ACTION_TO_STATE (NEW STATE) = ", newState);
  THIS.setState(newState);
};

export const stateAction = (state, action) => {
  const stateObject = {
    isSubmitting: actionIsSubmitting(state, action),
    documentLoadError: actionDocumentLoadError(state, action),
    mode: actionMode(state, action),
    pkg: actionPkg(state, action)
  };
  console.log("STATE_ACTION: ", stateObject);
  return stateObject;
};


const actionIsSubmitting = (state, action) => {
  switch (action.type) {
    case STATE_ACTION_IS_SUBMITTING: return true;
    case STATE_ACTION_IS_NOT_SUBMITTING: return false;
    case STATE_ACTION_LOADED_DATA: return false;
    default: return state.isSubmitting;
  }
};

const actionDocumentLoadError = (state, action) => {
  switch (action.type) {
    case STATE_ACTION_SET_DOCUMENT_LOAD_ERROR: return true;
    case STATE_ACTION_UNSET_DOCUMENT_LOAD_ERROR: return false;
    default: return state.documentLoadError;
  }
};

const actionMode = (state, action) => {
  return state.mode;
};

const actionPkg = (state, action) => {
  const pkgObject = {
    created: actionPkgCreated(state, action),
    modified: actionPkgModified(state, action),
    pkgIdentity: actionPkgIdentity(state, action),
    pkgAttachments: actionPkgAttachments(state, action),
    workflow: actionWorkflow(state, action),
    permissions: actionPermissions(state, action)
  };
  console.log(" ACTION_PKG ", pkgObject);
  return pkgObject;
};

const actionPkgCreated = (state, action) => {
  switch (action.type) {
    case STATE_ACTION_LOADED_DATA: return action.params.created ;
    default: return state.pkg.created;
  }
};

const actionPkgModified = (state, action) => {
  switch (action.type) {
    case STATE_ACTION_LOADED_DATA: return action.params.modified ;
    default: return state.pkg.created;
  }
};

const actionPkgIdentity = (state, action) => {
  switch (action.type) {
    case STATE_ACTION_RESET_IDENTITY: return identityInitialState();
    case STATE_ACTION_LOADED_DATA: return {...action.params.akomaNtoso};
    case STATE_ACTION_SET_FIELD_VALUE: 
      return __pkgIdentity(state, action.params.fieldName, action.params.fieldValue);
    case STATE_ACTION_SET_FIELD_ERROR:
      return __pkgIdentity(state, action.params.fieldName, action.params.fieldValue, action.params.err);
    default: return {...state.pkg.pkgIdentity};
  }
};

const actionPkgAttachments = (state, action) => {
  switch (action.type) {
    case STATE_ACTION_RESET_IDENTITY: return state.pkg.pkgAttachments;
    case STATE_ACTION_LOADED_DATA: return action.params.akomaNtoso['attachments'].value;
    default: return state.pkg.pkgAttachments;
  }
};

const actionWorkflow = (state, action) => {
  console.log(" actionWorkflow ", state.pkg.workflow);
  switch(action.type) {
    case STATE_ACTION_LOADED_DATA: 
      return action.params.workflow;
    default: return state.pkg.workflow;
  }
};

const actionPermissions = (state, action) => {
  switch(action.type) {
    case STATE_ACTION_LOADED_DATA: return action.params.permissions;
    default: return state.pkg.permissions;
  }
};





const copyObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}


/**
 * Clones identity object, it has multiple levels of nesting, so to keep 
 * things impler we use copyObject
 * @param {object} state 
 * @param {string} fieldName
 * @param {object} fieldValue
 * @param {object} err
 */
const __pkgIdentity = (state, fieldName, fieldValue, err) => {
  let pkgIdent = copyObject(state.pkg.pkgIdentity);
  if (fieldName === undefined) {
    return pkgIdent;
  } else {
    if (err === undefined) {
      // set field value .. no error
      return {
        ...pkgIdent,
        [fieldName]: {
          ...pkgIdent[fieldName],
          value: fieldValue,
          error: null
        }
      };
    } else {
      // set field error
      return {
        ...pkgIdent,
        [fieldName]: {
          ...pkgIdent[fieldName],
          value: err.value === null ? '': err.value,
          error: err.message
        }
      }
    }
  }
};


/**
 * Clones every attachment in pkgAttachments using map and Object.assign
 * There aren't further nested levels within array items
 * @param {*} state 
 */
const __pkgAttachments = (state) => {
  return state.pkg.pkgAttachments.map( 
      (item ) => Object.assign({}, item )
    );
};

const __workflow = (state) => {
  return copyObject(state.pkg.workflow);
};


const __permissions = (state) => {
  return copyObject(state.pkg.permissions);
};
