import { STATE_ACTION_RESET_IDENTITY, STATE_ACTION_IS_SUBMITTING, STATE_ACTION_UNSET_DOCUMENT_LOAD_ERROR, STATE_ACTION_SET_DOCUMENT_LOAD_ERROR, STATE_ACTION_IS_NOT_SUBMITTING, STATE_ACTION_SET_FIELD_VALUE, STATE_ACTION_LOADED_DATA, STATE_ACTION_SET_FIELD_ERROR, STATE_ACTION_IS_LOADING, STATE_ACTION_IS_NOT_LOADING, STATE_ACTION_SWITCH_TAB, STATE_ACTION_LOADED_DEFAULTS, STATE_ACTION_CONFIRM_ADD_OPEN, STATE_ACTION_CONFIRM_ADD_CLOSE } from './DocumentForm.constants';
import {identityInitialState} from './DocumentForm.formConfig';

/**
 * All setState() calls are routed via applyActionToState, 
 * there is no direct setState() done in the forms. 
 * This is borrowed from the action, state routing model used in redux.
 */
export const applyActionToState = (THIS, action) => {
  const newState = stateAction(THIS.state, action);
  //console.log("APPLY_ACTION_TO_STATE = ", action.type, action);
  //console.log("APPLY_ACTION_TO_STATE (NEW STATE) = ", newState);
  THIS.setState(newState);
};

/**
 * Creates the state object based on the current state and action params
 * @param {*} state  the current state
 * @param {*} action the action {type:..., params:{.... }}
 */
export const stateAction = (state, action) => {
  const stateObject = {
    isLoading: actionIsLoading(state, action),
    isSubmitting: actionIsSubmitting(state, action),
    documentLoadError: actionDocumentLoadError(state, action),
    mode: actionMode(state, action),
    pkg: actionPkg(state, action),
    activeTab: actionSwitchTab(state, action),
    confirmAdd: actionConfirmAdd(state, action)
  };
  //console.log("STATE_ACTION: ", stateObject);
  return stateObject;
};

/**
 * action for the activeTab state variable
 * @param {*} state 
 * @param {*} action 
 */
const actionSwitchTab = (state, action) => {
  switch (action.type) {
    case STATE_ACTION_SWITCH_TAB: return action.params.activeTab;
    default: return state.activeTab;
  }
};

/**
 * action for the confirmAdd state variable
 * @param {*} state 
 * @param {*} action 
 */
const actionConfirmAdd = (state, action) => {
  switch (action.type) {
    case STATE_ACTION_CONFIRM_ADD_OPEN: return true;
    case STATE_ACTION_CONFIRM_ADD_CLOSE: return false;
    default: return state.confirmAdd;
  }
};

/**
 * action for the isLoading state variable
 * @param {*} state 
 * @param {*} action 
 */
const actionIsLoading = (state, action) => {
  switch (action.type) {
    case STATE_ACTION_IS_LOADING: return true;
    case STATE_ACTION_IS_NOT_LOADING: return false;
    case STATE_ACTION_LOADED_DATA: return false;
    case STATE_ACTION_LOADED_DEFAULTS: return false;
    default: return state.isLoading;
  }
};

/**
 * action handler for isSubmitting state variable
 * @param {*} state 
 * @param {*} action 
 */
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

/**
 * We just set return the current mode for now
 * @param {*} state 
 * @param {*} action 
 */
const actionMode = (state, action) => {
  return state.mode;
};

/**
 * Builds the pkg object. 
 * @param {*} state 
 * @param {*} action 
 */
const actionPkg = (state, action) => {
  const pkgObject = {
    pkgIdentity: actionPkgIdentity(state, action),
    pkgAttachments: actionPkgAttachments(state, action),
    workflow: actionWorkflow(state, action),
    permissions: actionPermissions(state, action)
  };
  //console.log(" ACTION_PKG ", pkgObject);
  return pkgObject;
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
    case STATE_ACTION_LOADED_DEFAULTS: return action.params.workflow;
    default: return state.pkg.workflow;
  }
};

const actionPermissions = (state, action) => {
  switch(action.type) {
    case STATE_ACTION_LOADED_DEFAULTS: return action.params.permissions;
    case STATE_ACTION_LOADED_DATA: return action.params.permissions;
    default: return state.pkg.permissions;
  }
};

/**
 * 2018-05-09 Switched to making a shallow copy here
 * JSON.stringify doesnt correctly process object types like date
 * so will swtich to shallow copy; if there are side effects we will 
 * need to rewrite copyObject() to use JSON.stringify() with type awareness
 * (for an example of that see loadFormWithDocument() )
 * @param {*} obj 
 */
const copyObject = (obj) => {
/*   let newObj = JSON.parse(JSON.stringify(obj));
 */  
 let newObj = Object.assign({}, obj);
 return newObj;
}


/**
 * Clones identity object, it has multiple levels of nesting, so to keep 
 * things impler we use copyObject
 * 2018-05-09 - use correctErrorValue() to get the error default value from identityInitialState()
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
          value: correctErrorValue(fieldName, err.value),
          error: err.message
        }
      }
    }
  }
};

/**
 * Get the default value for the field from identity initial state
 * @param {*} fieldName 
 * @param {*} errValue 
 */
const correctErrorValue = (fieldName, errValue) => {
  const defaultValue = identityInitialState()[fieldName].value ; 
  return defaultValue;
};