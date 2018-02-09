import { notifySuccess, notifyError} from '../../utils/notifhelper';
import axios from 'axios';

import { apiUrl } from '../../api';

export const handleSuccess =  (data) => {
    console.log(" DATA === ", data);
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
 * @param {object} the context "this" in the caller form 
 */
export const handleSubmitEdit = (context) => {
    const request = axios.post(
      apiUrl('document-edit'), {
        data: context.state.form
      }
    );
    request
      .then(
        (response) => {
          context.setState({isSubmitting: false});
          handleSuccess(response.data);
        }
      )
      .catch(
        (err) => {
          context.setState({isSubmitting: false});
          handleApiException(err);
        }
      );
    return request;         
  };

/**
 * Makes a call to the edit api and submits the document content to be edited.
 * Returns a promise so the response can be handled further by the caller.
 * @param {object} the context "this" in the caller form 
 */
export const handleSubmitAdd = (context) => {
    axios.post(
      apiUrl('document-add'), {
        data: context.state.form
      }
      )
    .then(
      (response) => {
        context.setState({isSubmitting: false});
        handleSuccess(response.data);
      }
    )
    .catch(
      (err) => {
        context.setState({isSubmitting: false});
        handleApiException(err);
      }
    );      
  }

/**
 * Makes a call to the edit api and submits the document content to be edited.
 * Returns a promise so the response can be handled further by the caller.
 * @param {object} the context "this" in the caller form 
 */
export const handleApiException = (err) => {
    console.log(" Error while adding ", err);
};