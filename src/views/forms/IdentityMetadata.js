import React from 'react';
import {Form, FormFeedback, Card, CardHeader, CardBlock, CardBody, CardFooter, Row, Col, FormGroup, Label, Input, Button} from 'reactstrap';
import { Formik } from 'formik';
import Yup from 'yup';
import classnames from 'classnames';

import StdDiv from '../../components/StdDiv';
import InputDate from '../../components/InputDate';
import { lang } from 'moment';
import { getLangs, isEmpty } from '../../utils/generalhelper';
import FieldDocLanguage from './FieldDocLanguage2';
import {FormControl, formControlErrorClass} from './FormControl';
import {FieldError} from './FieldError';
import '../../css/IdentityMetadata.css';




const FieldDocType = ({onChange, value, error}) => {
  return (
  <FormControl className={ formControlErrorClass(error) }>
    <Label htmlFor="docType">Document Type</Label>
    <Input type="select" defaultValue=""  onChange={onChange} name="docType" id="doctype" required>
    <option value="" disabled >Select a Document Type</option>
      <option value="legislation">Legislation</option>
      <option value="constitution">Constitution</option>
      <option value="bill">Bill</option>
      <option value="judgement">Judgement</option>
    </Input>
    <FieldError error={error} />
  </FormControl>
  );
};
 
const FieldDocCountry = ({onChange, value, error}) => {
  return (
    <FormControl className={ formControlErrorClass(error) }>
      <Label htmlFor="docCountry">Country</Label>
      <Input type="select" defaultValue={value}  onChange={onChange} name="docCountry" id="country" required>
      <option value="" disabled >Select a Country</option>
        <option value="ke">Kenya</option>
        <option value="tz">Tanzania</option>
        <option value="ng">Nigeria</option>
        <option value="ao">Angola</option>
      </Input>
      <FieldError error={error} />
    </FormControl>
  );
}

const FieldDocTitle = ({onChange, value, error}) => {
  return (
    <FormControl className={ formControlErrorClass(error) }>
      <Label htmlFor="docTitle">Title</Label>
      <Input type="text" name="docTitle" value={value} onChange={onChange} id="doctitle" placeholder="Enter the Title of the document" required/>
      <FieldError error={error} />
    </FormControl>
  )
};

const FieldDocOfficialDate = ({onChange, onBlur, value, error}) => {
  return (
   <FormControl className={ formControlErrorClass(error) }>
    <Label htmlFor="docOfficialDate">Official Date</Label>
    <InputDate name="docOfficialDate" onChange={onChange}  onBlur={onBlur} initialValue={ value } required />
    <FieldError error={error} />
  </FormControl>
  );
}

const FieldIri = () => {
  return (
    <div className="form-group">
      <p className="form-control-static"><b>Document IRI:</b> /akn/ke/test </p>    
    </div>
  );
}

const FieldDocNumber = ({onChange, value, error}) =>
  <FormControl className={ formControlErrorClass(error) }>
    <Label htmlFor="docNumber">Document Number</Label>
    <Input type="text" id="docNumber" value={value} 
      onChange={onChange} 
      placeholder="Enter the official document number" required/>
    <FieldError error={error} />
  </FormControl> ;


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
        form: {
          docLang: {value: {} , error: null },
          docType: {value: '', error: null },
          docCountry: {value: '', error: null },
          docTitle: {value: '', error: null},
          docOfficialDate: {value: '', error: null },
          docNumber: {value: '', error: null }
        }
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
        }
      };
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

    componentDidMount(){
      const {form} = this.state ; 
      for (let field in form) {
        this.validateFormField(field, form[field].value);
      }
    }

    render() {
      const {isSubmitting, form} = this.state ; 
      const errors = this.formHasErrors();
      const formValid = isEmpty(errors);
      return (
        <div>
            <Form  noValidate>
            <Card>
                <CardHeader>
                    <strong>Document Identity</strong>
                    <small> Form</small>
                </CardHeader>
                <CardBody>
                <Row>
                    <Col xs="4">
                      </Col>
                      <Col xs="4">
                          <FieldIri />
                      </Col>
                      <Col xs="4">
                      </Col>
                    </Row>
                    <Row>
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
                          <FieldDocCountry value={form.docCountry.value} 
                            onChange={
                              (evt)=> {
                                this.validateFormField('docCountry', evt.target.value);
                              }
                            }  
                            error={errors.docCountry}
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
                </CardBody>
                <CardFooter>
                    <Button type="submit" size="sm" color="primary" disabled={isSubmitting || !formValid}><i className="fa fa-dot-circle-o"></i> Next</Button>
                    { " " }
                    <Button type="reset" size="sm" color="danger" ><i className="fa fa-ban"></i> Reset</Button>
                  </CardFooter>
            </Card>
          </Form>
      </div>
    );
    }
}


export default IdentityMetadata;
