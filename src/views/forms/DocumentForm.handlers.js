import { notifySuccess, notifyError} from '../../utils/NotifHelper';
import axios from 'axios';

import { apiUrl } from '../../api';
import { identityInitialState } from './DocumentForm.formConfig';
import { STATE_ACTION_RESET, STATE_ACTION_IS_SUBMITTING } from './DocumentForm.constants';

/** EVENT HANDLERS */
export const handleSuccess =  (THIS, data) => {
    const {success, error} = data ; 
    if (success) {
        let {code, message} = success ; 
        notifySuccess( `${code} - Document was saved ${message}`);
    }  
    if (error) {
        let {code, message} = error ;
        notifyError( `${code} - ${message} `);
    } 
};

/**
 * Makes a call to the edit api and submits the document content to be edited.
 * Returns a promise so the response can be handled further by the caller.
 * @param {object} the THIS "this" in the caller form 
 */
export const handleSubmitEdit = (THIS) => {
    const request = axios.post(
      apiUrl('document-edit'), {
        data: THIS.state.form
      }
    );
    request
      .then(
        (response) => {
          THIS.setState({isSubmitting: false});
          handleSuccess(response.data);
        }
      )
      .catch(
        (err) => {
          THIS.setState({isSubmitting: false});
          handleApiException(THIS, err);
        }
      );
    return request;         
  };

/**
 * Makes a call to the edit api and submits the document content to be edited.
 * Returns a promise so the response can be handled further by the caller.
 * @param {object} the context "this" in the caller form 
 */
export const handleSubmitAdd = (THIS) => {
    axios.post(
      apiUrl('document-add'), {
        data: THIS.state.form
      }
      )
    .then(
      (response) => {
        THIS.setState({isSubmitting: false});
        handleSuccess(response.data);
      }
    )
    .catch(
      (err) => {
        THIS.setState({isSubmitting: false});
        handleApiException(err);
      }
    );      
  }

/**
 * Makes a call to the edit api and submits the document content to be edited.
 * Returns a promise so the response can be handled further by the caller.
 * @param {object} the context "this" in the caller form 
 */
export const handleApiException = (THIS, err) => {
    console.log(" Error while adding ", err);
};


/** STATE HANDLERS  */

export const stateAction = (state, action) => {
    switch (action.type) {
      case STATE_ACTION_RESET:
        return Object.assign(
          {}, 
          state, 
          {pkg: {pkgIdentity: identityInitialState()}}
        );
      case STATE_ACTION_IS_SUBMITTING:
        return Object.assign(
          {}, 
          state, 
          {isSubmitting: action.params.isSubmitting}
        );
      default:
        return state;
    }
};

export const applyActionToState = (THIS, action) => {
  THIS.setState(stateAction(THIS.state, action));
};