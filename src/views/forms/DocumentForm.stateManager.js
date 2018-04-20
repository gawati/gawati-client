import { STATE_ACTION_RESET, STATE_ACTION_IS_SUBMITTING, STATE_ACTION_SET_DOCUMENT_LOAD_ERROR, STATE_ACTION_IS_NOT_SUBMITTING, STATE_ACTION_SET_FIELD_VALUE, STATE_ACTION_LOADED_DATA, STATE_ACTION_SET_FIELD_ERROR } from './DocumentForm.constants';
import {identityInitialState} from './DocumentForm.formConfig';
/** STATE HANDLERS  */

export const stateAction = (state, action) => {
    switch (action.type) {
      case STATE_ACTION_RESET:
        return Object.assign(
          {}, 
          state, 
          {pkg: {
            pkgIdentity: identityInitialState()},
            pkgAttachments: [...state.pkg.pkgAttachments]
          }
        );
      case STATE_ACTION_IS_SUBMITTING:
        return Object.assign(
          {}, 
          state, 
          {isSubmitting: true}
        );
      case STATE_ACTION_IS_NOT_SUBMITTING:
        return Object.assign(
          {}, 
          state, 
          {isSubmitting: false}
        );
      case STATE_ACTION_LOADED_DATA:
        // action.params = {isSubmitting: true / false,   pkg: {pkgIdentity: aknDoc}}
        return Object.assign(
          {}, 
          state, 
          {isSubmitting: false, pkg: {
            pkgIdentity: action.params.aknDoc,
            pkgAttachments: [...state.pkg.pkgAttachments]
          }}
        );
      case STATE_ACTION_SET_FIELD_VALUE:
        return Object.assign(
          {},
          state,
          {
            pkg: {
                pkgIdentity: {
                    ...state.pkg.pkgIdentity, 
                    [action.params.fieldName]: {
                        ...state.pkg.pkgIdentity[action.params.fieldName], 
                        value: action.params.fieldValue,
                        error: null
                    }
                },
                pkgAttachments: [...state.pkg.pkgAttachments]
            }
          }
        );
      case STATE_ACTION_SET_FIELD_ERROR:
        return Object.assign(
          {},
          state,
          {
            pkg:{
                pkgIdentity: {
                    ...state.pkg.pkgIdentity, 
                      [action.params.fieldName]: {
                        ...state.pkg.pkgIdentity[action.params.fieldName], 
                        value: action.params.err.value === null ? '': action.params.err.value,
                        error: action.params.err.message
                    }
                },
                pkgAttachments: [...state.pkg.pkgAttachments]
              }
          }
        );
      case STATE_ACTION_SET_DOCUMENT_LOAD_ERROR:
        return Object.assign(
          {},
          state,
          {
            documentLoadError: true
          }
        );
      default:
        return state;
    }
};

export const applyActionToState = (THIS, action) => {
  THIS.setState(stateAction(THIS.state, action));
};