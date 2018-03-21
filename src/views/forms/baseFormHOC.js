import React from 'react';

import axios from 'axios';
import moment from 'moment';

import { apiUrl } from '../../api';
import { handleApiException } from '../../utils/NotifHelper';

/**
 * Higher Order Component for shared form functions.
 * (React discourages the use of inheritance, which is why 
 *  we didnt simply stuff this into a base class ).
 * This HOC provides, the following as props to the wrapped component:
 *   1. form state structure
 *   form helper apis:
 *   2. setFieldValue , 3. setFieldError, 4. validateFormField 
 * 
 * @returns 
 */
function loadbaseForm() {
    return function(WrappedComponent) {
      class FormLoader extends React.Component {
        
        constructor(props) {
          super(props);
          this.state = {
            form: this.formInitialState()
          }
        }

        /**
         * Returns a promise. Does not set any submitting states !
         */
        loadFormWithDocument = (thisIri) => {
          let iri = thisIri.startsWith("/") ? thisIri : `/${thisIri}` ;
          const loadForm = axios.post(
              apiUrl('document-open'), {
                data: {"iri": iri}
              }
          );

          loadForm
            .then(
              (response) => {
                  const {error, akomaNtoso} = response.data;
                  if (error) {
                    this.setState({ documentLoadError: true });
                  } else {
                    let aknDoc = akomaNtoso; 
                    aknDoc.docOfficialDate.value = moment(aknDoc.docOfficialDate.value, "YYYY-MM-DD", true).toDate();
                    this.setState({
                      form: aknDoc
                    });
                  } 
              }
            )
            .catch(
              (err) => {
                handleApiException(err);
              }
            );
          console.log(" THIS>STATE>FORM ", this.state.form);
          return loadForm;  
        };

        formInitialState = () => (
          {
              docLang: {value: {} , error: null },
              docType: {value: '', error: null },
              docAknType: {value: '', error: null },
              docCountry: {value: '', error: null },
              docTitle: {value: '', error: null},
              docOfficialDate: {value: undefined, error: null },
              docNumber: {value: '', error: null },
              docPart: {value: '', error: null },
              docIri : {value: '', error: null }
          }
        );

        /**
         * Checks if a form has errors
         * Returns an object with field names as keys which 
         * have errors.
         */
        formHasErrors = () => {
          const {form} = this.state;
          let errors = {};
          for (let field in form) {
            if ( form[field].error !== null ) {
              errors[field] = form[field];
            }
          }
          return errors;
        }
        ; 

        setFieldValue = (fieldName, value) => 
        this.setState({
          form: {
            ...this.state.form, 
            [fieldName]: {
              ...this.state.form[fieldName], 
              value: value,
              error: null
            }
          }
        })
        ;
  
      setFieldError = (fieldName, err) => {
        this.setState({
          form: {
            ...this.state.form, 
            [fieldName]: {
              ...this.state.form[fieldName], 
              value: err.value === null ? '': err.value,
              error: err.message
            }
          }
        });
      };


      /**
       * Validates the value of the passed in field name
       * using the Yup validator specified in the validationSchema
       */
      validateFormField = (fieldName, fieldValue) => {
        //console.log( " VALIDATING ", fieldName, fieldValue);
        this.validationSchema[fieldName].validate
          .validate(fieldValue)
            .then((value) => {
              this.setFieldValue(fieldName, value);
            })                                  
          .catch((err)=> {
            //console.log(" FIELD ERROR ", fieldName, err);
            this.setFieldError(fieldName, err);
          });  
      }
      
        render() {
          const { form, documentLoadError } = this.state ; 
          return (
            <WrappedComponent {...this.props} 
                form={form} 
                setFieldValue={this.setFieldValue} 
                setFieldError={this.setFieldError}
                validateFormField={this.validateFormField}  
                formHasErrors={this.formHasErrors}
                loadFormWithDocument={this.loadFormWithDocument}
                documentLoadError={documentLoadError}
            />
          );
        }
      }
      return FormLoader;
    }
}

export default loadbaseForm;

