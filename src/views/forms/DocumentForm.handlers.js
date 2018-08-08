import { notifySuccess, notifyError, notifyWarning} from '../../utils/NotifHelper';
import axios from 'axios';

import { apiUrl } from '../../api';
import {STATE_ACTION_IS_NOT_SUBMITTING, MSG_DOC_EXISTS_ON_CLIENT, STATE_ACTION_CONFIRM_ADD_OPEN} from './DocumentForm.constants';
import {applyActionToState} from './DocumentForm.stateManager';

/** EVENT HANDLERS */
export const handleSuccess =  (data) => {
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
export const handleSubmitEdit = (THIS, data) => {
    const request = axios.post(
      apiUrl('document-edit'), {
        data: data
      }
    );
    request
      .then(
        (response) => {
          applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
          handleSuccess(response.data);
        }
      )
      .catch(
        (err) => {
          applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
          handleApiException(THIS, err);
        }
      );
    return request;         
  };

/**
 * Makes a call to the add api and submits the document content to be added.
 * Returns a promise so the response can be handled further by the caller.
 * @param {object} the context "this" in the caller form 
 */
export const handleSubmitAdd = (THIS, pkg, skipCheck=false) => {
    let iri = pkg.pkgIdentity.docIri.value;
    axios.post(
      apiUrl('document-add'), {
        data: {pkg, skipCheck}
      }
      )
    .then(
      (response) => {
        applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
        const {error} = response.data;
        if (error != null) {
          notifyWarning(error.message);
        } else {
          switch(response.data) {
            case 'doc_exists_on_client':
              notifyWarning(MSG_DOC_EXISTS_ON_CLIENT);
              break;
            case 'doc_exists_on_portal':
              applyActionToState(THIS, {type: STATE_ACTION_CONFIRM_ADD_OPEN});
              break;
            default:
              handleSuccess(response.data);
              THIS.reloadAddedDoc(iri);
          }
        }
      }
    )
    .catch(
      (err) => {
        applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
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
    console.log(" Error while adding ", THIS, err);
};

/**
 * Remove Attachment (embedded doc)
 */
export const handleRemoveAttachment = (THIS, data, postRemove) => {
    axios.post(
      apiUrl('attachment-remove'), {
        data: data
      }
      )
    .then(
      (response) => {
        applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
        handleSuccess(response.data);
        postRemove();
      }
    )
    .catch(
      (err) => {
        applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
        handleApiException(err);
      }
    );
}

/**
 * Extract Attachment (embedded doc)
 */
export const handleExtractAttachment = (THIS, data) => {
    axios.post(
      apiUrl('attachment-extract'), {
        data: data
      }
      )
    .then(
      (response) => {
        applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
        handleSuccess(response.data);
      }
    )
    .catch(
      (err) => {
        applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
        handleApiException(err);
      }
    );
}

/**
 * Refresh tags for the document
 */
export const handleRefreshTags = (THIS, reload) => {
    axios.post(
      apiUrl('document-tags-refresh'), {
        data: {
          'iri': THIS.state.pkg.pkgIdentity.docIri.value
        }
      }
      )
    .then(
      (response) => {
        applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
        handleSuccess(response.data);
        reload();
      }
    )
    .catch(
      (err) => {
        applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
        handleApiException(err);
      }
    );
}

/**
 * Makes a call to the custom metadata's edit API and submits the 
 * metadata fields to be edited. 
 */
export const handleSubmitEditCustMeta = (THIS, pkg, selected, reload) => {
    const request = axios.post(
      apiUrl('documents-custom-meta-edit'), {
        data: {pkg, selected}
      }
    );
    request
      .then(
        (response) => {
          applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
          handleSuccess(response.data);
          reload();
        }
      )
      .catch(
        (err) => {
          applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
          handleApiException(THIS, err);
        }
      );
    return request;         
  };
