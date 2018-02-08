import React from 'react';
import {Form, Card, CardHeader, CardBody, CardFooter, Row, Col, Button} from 'reactstrap';

import axios from 'axios';
import moment from 'moment';

import { isEmpty } from '../../utils/generalhelper';
import {getDocTypeFromLocalType} from '../../utils/doctypeshelper';
import { isInvalidValue } from '../../utils/generalhelper';
import { aknExprIri, aknWorkIri, normalizeDocNumber, unknownIriComponent } from '../../utils/urihelper';
import { iriDate, isValidDate } from '../../utils/datehelper';

import FieldDocLanguage from './FieldDocLanguage2';
import FieldIri from './FieldIri';
import FieldDocCountry from './FieldDocCountry';
import FieldDocNumber from './FieldDocNumber';
import FieldDocTitle from './FieldDocTitle';
import FieldDocType from './FieldDocType';
import FieldDocOfficialDate from './FieldDocOfficialDate';
import FieldDocPart from './FieldDocPart';

import {formInitialState, validationSchema} from './identityMetadata.formConfig';

import '../../css/IdentityMetadata.css';
import { apiUrl } from '../../api';

import {handleSuccess, handleApiException} from './identityMetadata.handlers';

class IdentityMetadata extends React.Component {
/**
 * Creates an instance of IdentityMetadata.
 * @param {any} props 
 * @memberof IdentityMetadata
 */
constructor(props) {
      super(props);
      this.state = {
        isSubmitting: false,
        mode: props.mode,
        /* 
        form has field names as state values 
        i.e. docTitle has to have a corresponding 
        <input name="docTitle" .... /> in the form
        */ 
        form: formInitialState()
      };
      /** 
       * This provides validation of each field value using Yup
       * The validator function is declared in Yup syntax here, and
       * applied in the onChange of the field. 
       */
      this.validationSchema = validationSchema();
      // bindings
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleReset = this.handleReset.bind(this);
    }

    


    generateIRI = ({docCountry, docType, docAknType, docOfficialDate, docNumber, docLang, docPart }) => {
      const unknown = unknownIriComponent(); 
      var iriCountry, iriType, iriOfficialDate, iriNumber, iriLang, iriPart , iriSubType; 
      iriType = isInvalidValue(docAknType.value) ? unknown : docAknType.value ;
      iriSubType = isInvalidValue(docType.value) ? unknown: docType.value ;
      iriCountry = isInvalidValue(docCountry.value) ? unknown : docCountry.value ; 
      iriOfficialDate = isValidDate(docOfficialDate.value) ? iriDate(docOfficialDate.value) : unknown ;
      iriNumber = isInvalidValue(docNumber.value) ? unknown : normalizeDocNumber(docNumber.value); 
      iriLang = isInvalidValue(docLang.value.value) ? unknown : docLang.value.value ;
      iriPart = isInvalidValue(docPart.value) ? unknown : docPart.value ; 
      return aknExprIri(
        aknWorkIri(
          iriCountry, 
          iriType, 
          iriSubType, 
          iriOfficialDate, 
          iriNumber
        ),
        iriLang, 
        iriPart
      );
    };

    updateIriValue = () => {
      this.setFieldValue("docIri", this.generateIRI(this.state.form));
    }
      
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


    /**
     * Check the errors in the form on load
     */
    componentDidMount(){
      const {mode} = this.props;
      if (mode === "edit") {
          // load iri date
          this.loadFormWithDocument();
      } else {
        // add mode ... validate empty form
        this.validateFormFields();
      }
    }

    stateObject = (value) => {
      return {
        value: value, 
        error: null
      };
    };

    loadFormWithDocument = () => {
      let {iri} = this.props ; 
      this.setState({isSubmitting: true});
      iri = iri.startsWith("/") ? iri : `/${iri}` ;
      axios.post(
        apiUrl('document-open'), {
          data: {"iri": iri}
        }
        )
      .then(
        (response) => {
            //console.log(" response.data ", response);
            let aknDoc = response.data.akomaNtoso; 
            aknDoc.docOfficialDate.value = moment(aknDoc.docOfficialDate.value, "YYYY-MM-DD", true).toDate();
            this.setState({
              isSubmitting: false,
              form: aknDoc
            });
        }
      )
      .catch(
        (err) => {
          this.setState({isSubmitting: false});
          handleApiException(err);
        }
      );
    };

    validateFormFields() {
      const {form} = this.state ; 
      for (let field in form) {
        // !+FUTURE_FIX(kohsah, 2018-01-16) aggregate state and set it in one shot
        this.validateFormField(field, form[field].value);
      }
    }
    
    handleSubmit(event) {
      event.preventDefault();
      this.setState({isSubmitting: true});
      let frm = this.state.form; 
      const {mode} = this.props;
      console.log(" FORM ", frm);
      if (mode === "edit") {
        console.log(" SUbmitting in edit mode ");   
        this.handleSubmitEdit();     
      }
      if (mode === "add") {
        this.handleSubmitAdd();
      }
    }

/*     successResponse(response) {
        this.setState({isSubmitting: false});
        console.log(" RESPONSE SUCCESS ", response.data);
        const {success, error} = response.data ; 
        if (success) {
          let {code, message} = success ; 
          notifySuccess( `${code} - Document was saved ${message}`);
        }  
        if (error) {
          let {code, message} = error ;
          notifyError( `${code} - ${message} `);
        } 
    } */

    handleSubmitEdit() {
      axios.post(
        apiUrl('document-edit'), {
          data: this.state.form
        }
      )
      .then(
        (response) => {
          this.setState({isSubmitting: false});
          handleSuccess(response.data);
        }
      )
      .catch(
        (err) => {
          this.setState({isSubmitting: false});
          handleApiException(err);
        }
      );         
    }

    handleSubmitAdd() {
      axios.post(
        apiUrl('document-add'), {
          data: this.state.form
        }
        )
      .then(
        (response) => {
          this.setState({isSubmitting: false});
          handleSuccess(response.data);
        }
      )
      .catch(
        (err) => {
          this.setState({isSubmitting: false});
          handleApiException(err);
        }
      );      
    }

    handleReset(event) {
      event.preventDefault();
      console.log(" Calling Alert info");
      this.setState({
        form: this.formInitialState()
      });
    }

    render() {
      const {isSubmitting, form} = this.state ; 
      const {mode} = this.props ;
      const errors = this.formHasErrors();
      const formValid = isEmpty(errors);
      return (
        <div>
            <Form  onSubmit={this.handleSubmit} noValidate>
            <Card>
                <CardHeader>
                    <strong>Document Identity</strong>
                    <small> Form</small>
                </CardHeader>
                <CardBody>
                <Row>
                    <Col xs="3">
                      </Col>
                      <Col xs="6">
                          <FieldIri form={form} formValid={formValid}  />
                      </Col>
                      <Col xs="3">
                      </Col>
                    </Row>
                    <Row>
                    <Col xs="4">
                      <FieldDocCountry value={form.docCountry.value} readOnly={ mode === "edit" }
                              onChange={
                                (evt)=> {
                                  this.validateFormField('docCountry', evt.target.value);
                                  this.updateIriValue();
                                }
                              }  
                              error={errors.docCountry}
                            />
                      </Col>
                      <Col xs="4">
                          <FieldDocType name="docType"
                            value={form.docType.value} 
                            readOnly={ mode === "edit" }
                            onChange={
                              (evt)=> {
                                const fieldValue = evt.target.value ;
                                this.validateFormField('docType',fieldValue);
                                this.validateFormField(
                                  'docAknType',  
                                  fieldValue !== "" ? getDocTypeFromLocalType(fieldValue).aknType : ""
                                );
                                this.updateIriValue();                              }
                            }  
                            error={errors.docType}
                            />
                          <input type="hidden" name="docAknType" value={form.docAknType.value} error={errors.docAknType} />
                      </Col>
                      <Col xs="4">
                       { 
                          /* There is no real onChange event here - we just called it like that its just a parent caller
                            used by the Component implementation to set the value in the state */ 
                        }
                        <FieldDocLanguage name="docLang" 
                          readOnly={ mode === "edit" }
                          onChange={
                              (field, value) => {
                                // we set an empty object as the default for validation since 
                                // we have specified an object as neccessary for the schema.
                               this.validateFormField(field, value === null ? {}: value);
                               this.updateIriValue();
                              }
                           }
                          value={form.docLang.value}
                          error={errors.docLang}
                           />
                      </Col>
                    </Row>              
 
                    <Row>
                      <Col xs="4">
                          <FieldDocOfficialDate  value={form.docOfficialDate.value} 
                            readOnly={ mode === "edit" }
                            onChange={
                              (field, value)=> {
                                this.validateFormField(field, value);
                                this.updateIriValue();
                              }
                            }
                            error={errors.docOfficialDate}
                          />
                      </Col>
                      <Col xs="4">
                          <FieldDocNumber value={form.docNumber.value}
                            readOnly={ mode === "edit" }
                            onChange={
                              (evt)=> {
                                this.validateFormField('docNumber', evt.target.value);
                                this.updateIriValue();
                              }
                            }
                            error={errors.docNumber}
                          />
                      </Col>
                      <Col xs="4">
                            <FieldDocPart value={form.docPart.value}
                              readOnly={ mode === "edit" }
                              onChange={
                                (evt)=> {
                                  const val = evt.target.value ; 
                                  console.log(" PART onChange = ", val);
                                  this.validateFormField('docPart', val);
                                  this.updateIriValue();
                                }
                              }
                              error={errors.docPart}
                            />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">
                          <FieldDocTitle value={form.docTitle.value}
                            onChange={
                              (evt)=> {
                                  this.validateFormField('docTitle', evt.target.value);
                                }
                              }
                            error={errors.docTitle}
                          />
                      </Col>
                    </Row>
                </CardBody>
                <CardFooter>
                    <Button type="submit" size="sm" color="primary" disabled={isSubmitting || !formValid}><i className="fa fa-dot-circle-o"></i> Next</Button>
                    { " " }
                    <Button type="reset" size="sm" disabled={ mode === "edit" } color="danger" onClick={this.handleReset}><i className="fa fa-ban"></i> Reset</Button>
                  </CardFooter>
            </Card>
          </Form>
      </div>
    );
    }
}


export default IdentityMetadata;
