import React from 'react';
import {Form, Card, CardHeader, CardBody, CardFooter, Row, Col, Button} from 'reactstrap';
import Yup from 'yup';

import axios from 'axios';

import { isEmpty } from '../../utils/generalhelper';

import FieldDocLanguage from './FieldDocLanguage2';
import FieldIri from './FieldIri';
import FieldDocCountry from './FieldDocCountry';
import FieldDocNumber from './FieldDocNumber';
import FieldDocTitle from './FieldDocTitle';
import FieldDocType from './FieldDocType';
import FieldDocOfficialDate from './FieldDocOfficialDate';

import '../../css/IdentityMetadata.css';



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
        /* 
        form has field names as state values 
        i.e. docTitle has to have a corresponding 
        <input name="docTitle" .... /> in the form
        */ 
        form: this.formInitialState()
      };
      /** 
       * This provides validation of each field value using Yup
       * The validator function is declared in Yup syntax here, and
       * applied in the onChange of the field. 
       */
      this.validationSchema = {
        docLang: {
          validate:  Yup.object()
                        .shape({
                            label: Yup.string().required(), 
                            value: Yup.string().required("You must select a language")
                        })
                        .required(" Enter a language") 
        }, 
        docType: {
          validate:  Yup.string().required(" You must select a document type")
        },
        docCountry: {
          validate:  Yup.string().required(" You must select a country")
        },
        docTitle: {
          validate:  Yup.string().required(" Title is required ")
        },
        docOfficialDate: {
          validate: Yup.date(" Official date is required").typeError(" You need to enter a date")
        },
        docNumber: {
          validate: Yup.string().required(" Document number is required ")
        }, 
        docPart: {
          validate: Yup.string()
        },
        docIri: {
          validate: Yup.string()
        }
      };
      // bindings
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleReset = this.handleReset.bind(this);
    }

    formInitialState = () => {
      return (
        {
          docLang: {value: {} , error: null },
          docType: {value: '', error: null },
          docCountry: {value: '', error: null },
          docTitle: {value: '', error: null},
          docOfficialDate: {value: '', error: null },
          docNumber: {value: '', error: null },
          docPart: {value: 'main', error: null },
          docIri : {value: '', error: null }
        }
      );
    };
    
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
      this.validationSchema[fieldName].validate
        .validate(fieldValue)
          .then((value) => {
            this.setFieldValue(fieldName, value);
          })                                  
        .catch((err)=> {
          this.setFieldError(fieldName, err);
        });  
    }

    /**
     * Check the errors in the form on load
     */
    componentDidMount(){
      this.validateFormFields();
    }

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
      axios.post(
          "/gw/client/document/add/", {
          data: this.state.form
        }
        )
      .then(
        (response) => {
          this.setState({isSubmitting: false});
          console.log(" RESPOONSE ", response);
        }
      )
      .catch(
        (err) => {
          this.setState({isSubmitting: false});
          console.log(" ERR ", err);
        }
      );

      //      setTimeout(function() { 
//       this.setState({isSubmitting: false}); 
//      }.bind(this), 3000);
    }

    handleReset(event) {
      event.preventDefault();
      this.setState({
        form: this.formInitialState()
      });
    }

    render() {
      const {isSubmitting, form} = this.state ; 
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
                          <FieldIri form={form} formValid={formValid} />
                      </Col>
                      <Col xs="3">
                      </Col>
                    </Row>
                    <Row>
                    <Col xs="4">
                      <FieldDocCountry value={form.docCountry.value} 
                              onChange={
                                (evt)=> {
                                  this.validateFormField('docCountry', evt.target.value);
                                }
                              }  
                              error={errors.docCountry}
                            />
                      </Col>
                      <Col xs="4">
                          <FieldDocType name="docType"
                            value={form.docType.value} 
                            onChange={
                              (evt)=> {
                                this.validateFormField('docType', evt.target.value);
                              }
                            }  
                            error={errors.docType}
                            />
                      </Col>
                      <Col xs="4">
                       { 
                          /* There is no real onChange event here - we just called it like that its just a parent caller
                            used by the Component implementation to set the value in the state */ 
                        }
                        <FieldDocLanguage name="docLang" 
                          onChange={
                              (field, value) => {
                                // we set an empty object as the default for validation since 
                                // we have specified an object as neccessary for the schema.
                               this.validateFormField(field, value === null ? {}: value);
                              }
                           }
                          value={form.docLang.value}
                          error={errors.docLang}
                           />
                      </Col>
                    </Row>              
 
                    <Row>
                      <Col xs="6">
                          <FieldDocOfficialDate  value={form.docOfficialDate.value} 
                            onChange={
                              (field, value)=> {
                                this.validateFormField(field, value);
                              }
                            }
                            error={errors.docOfficialDate}
                          />
                      </Col>
                      <Col xs="6">
                          <FieldDocNumber value={form.docNumber.value}
                            onChange={
                              (evt)=> {
                                this.validateFormField('docNumber', evt.target.value);
                              }
                            }
                            error={errors.docNumber}
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
                    <Button type="reset" size="sm" color="danger" onClick={this.handleReset}><i className="fa fa-ban"></i> Reset</Button>
                  </CardFooter>
            </Card>
          </Form>
      </div>
    );
    }
}


export default IdentityMetadata;
