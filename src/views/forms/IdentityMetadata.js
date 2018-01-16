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
  console.log(" official date error ", error);
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
    <div class="form-group">
      <p class="form-control-static"><b>Document IRI:</b> /akn/ke/test </p>    
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

    constructor(props) {
      super(props);
      this.state = {
        errorMsgs: [],
        error: false
      }
    }

    handleDefaultChange = (event) => {
      console.log(" CHANGE ", event.target);
      if (!event.target.value) {
        this.setState({error: true});
      }
    }

    render() {
        return (
          <div>
            <Formik 
                initialValues={
                  {
                    docLang: '',
                    docType: '',
                    docCountry: '',
                    docTitle: '',
                    docOfficialDate: null,
                    docNumber: ''
                  }
                }
                
                validationSchema={
                  Yup.object().shape(
                    {
                      //"docLang.label": Yup.string(),
                      //"docLang.value": Yup.string().required(" You need to select a language"),
                      docLang: Yup.object()
                        .shape({label: Yup.string(), value: Yup.string()})
                          .test('is-lang', 'You must select a language', value => { return value.value !== undefined } ),
                      docType: Yup.string().required(" You must select a document type"),
                      docCountry: Yup.string().required(" You must select a country"),
                      docTitle: Yup.string().required(" Title is required "),
                      docOfficialDate: Yup.date(" Official date is required").typeError(" You need to enter a date"),
                      docNumber: Yup.string().required(" Document number is required ")
                    }
                  )
                }

                onSubmit={
                  (values, {setSubmitting, setErrors})=>  {
                      setSubmitting(false);
                      console.log(" VALUES = ", values);
                  }
                }

                render={
                  ({values, touched, dirty, errors, handleSubmit, handleReset, handleChange, setFieldValue, setFieldTouched, isSubmitting}) => {
                    //const submittingErrors =  isSubmitting || isEmpty(errors) ; 
                    //console.log( " ERRORS ", errors, submittingErrors);
                    return (
                    <Form onSubmit={handleSubmit} noValidate>
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
                                <FieldDocLanguage name="docLang" error={errors.docLang} onChange={setFieldValue}  onBlur={setFieldTouched} touched={touched.docLang} value={values.docLang}  />
                              </Col>
                              <Col xs="4">
                                  <FieldDocType  error={touched.docType && errors.docType} onChange={handleChange}  value={values.docType} />
                              </Col>
                              <Col xs="4">
                                  <FieldDocCountry  error={touched.docCountry && errors.docCountry} onChange={handleChange}   value={values.docCountry} />
                              </Col>
                            </Row>              
                            <Row>
                              <Col xs="12">
                                  <FieldDocTitle error={touched.docTitle && errors.docTitle} onChange={handleChange}   value={values.docTitle}  />
                              </Col>
                            </Row>
                            <Row>
                              <Col xs="6">
                                  <FieldDocOfficialDate  error={touched.docOfficialDate && errors.docOfficialDate} onChange={setFieldValue} onBlur={setFieldTouched} touched={touched.docOfficialDate} value={values.docOfficialDate}  />
                              </Col>
                              <Col xs="6">
                                  <FieldDocNumber  error={touched.docNumber && errors.docNumber}  onChange={handleChange} value={values.docNumber} />
                              </Col>
                            </Row>
                        </CardBody>
                        <CardFooter>
                            <Button type="submit" disabled={ isSubmitting } size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Next</Button>
                            { " " }
                            <Button type="reset" size="sm" color="danger" onClick={handleReset} ><i className="fa fa-ban"></i> Reset</Button>
                          </CardFooter>
                    </Card>
                  </Form>
                    );
                  }
                }
          />
        </div>
      );
    }
}


export default IdentityMetadata;
