import React from 'react';
import {Form, FormFeedback, Card, CardHeader, CardBlock, CardBody, CardFooter, Row, Col, FormGroup, Label, Input, Button} from 'reactstrap';
import { Formik } from 'formik';
import Yup from 'yup';

import StdDiv from '../../components/StdDiv';
import InputDate from '../../components/InputDate';
import { lang } from 'moment';
import { getLangs } from '../../utils/generalhelper';
import FieldDocLanguage from './FieldDocLanguage2';

const FieldError = ({error}) => {
  console.log(" FIELD ERROR ", error );
  if (error) {
    console.log(" HERE SXSS");
    return (
      <FormFeedback>{error}</FormFeedback>
    );
  } else {
    return null;
  }
}





const FieldDocType = ({onChange, value}) =>
  <FormGroup>
  <Label htmlFor="docType">Document Type</Label>
  <Input type="select" defaultValue=""  onChange={onChange} name="docType" id="doctype" required>
  <option value="" disabled >Select a Document Type</option>
    <option value="legislation">Legislation</option>
    <option value="constitution">Constitution</option>
    <option value="bill">Bill</option>
    <option value="judgement">Judgement</option>
  </Input>
  </FormGroup>;

const FieldDocCountry = ({onChange, value}) =>
  <FormGroup>
  <Label htmlFor="docCountry">Country</Label>
  <Input type="select" defaultValue={value}  onChange={onChange} name="docCountry" id="country" required>
  <option value="" disabled >Select a Country</option>
    <option value="ke">Kenya</option>
    <option value="tz">Tanzania</option>
    <option value="ng">Nigeria</option>
    <option value="ao">Angola</option>
  </Input>
  </FormGroup>;

const FieldDocTitle = ({onChange, value, error}) =>
  <FormGroup>
    <Label htmlFor="docTitle">Title</Label>
    <Input type="text" name="docTitle" value={value} onChange={onChange} id="doctitle" placeholder="Enter the Title of the document" required/>
    <FieldError error={error} />
  </FormGroup>;

const FieldDocOfficialDate = ({onChange, value}) =>
  <FormGroup>
    <Label htmlFor="docOfficialDate">Official Date</Label>
    <InputDate name="docOfficialDate" onChange={onChange} initialValue={ value } required />
  </FormGroup>;

const FieldDocNumber = ({onChange, value}) =>
  <FormGroup>
    <Label htmlFor="docNumber">Document Number</Label>
    <Input type="text" id="docNumber" value={value} onChange={onChange} placeholder="Enter the official document number" required/>
  </FormGroup> ;


class IdentityMetadata extends React.Component {

    FORM_FIELD_NAMES = [
      "docLang",
      "docType",
      "docCountry",
      "docTitle",
      "docOfficialDate",
      "docNumber"
    ];

    constructor(props) {
      super(props);
      this.state = {
        errorMsgs: [],
        error: false
      }
    }

    formValidate = ( formItems ) => {

    }

/*     handleSubmit = (event) => {
      event.preventDefault();
      this.FORM_FIELD_NAMES.map( 
        name => console.log(` FIELD ${name}  ${event.target[name].value} `) );
    } */

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
            docOfficialDate: new Date(),
            docNumber: ''
          }
        }
        
        validationSchema={
          Yup.object().shape(
            {
             /*  docLanguage: Yup.string()
                .required("Language code is required !"), */
/*               docType: Yup.string().required(" Document Type is required "),
              docCountry: Yup.string().required(" Country is required") , */
              docTitle: Yup.string().required(" Title is required ") /*,
              docOfficialDate: Yup.string().required(" Official Date is required "),
              docNumber: Yup.string().required(" Document number is required ") */
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
            console.log( " ERRORS ", errors);
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
                        <FieldDocLanguage onChange={setFieldValue}  onBlur={setFieldTouched} touched={touched.docLang} value={values.docLang}  />
                      </Col>
                      <Col xs="4">
                          <FieldDocType onChange={handleChange}  value={values.docType} />
                      </Col>
                      <Col xs="4">
                          <FieldDocCountry onChange={handleChange}   value={values.docCountry} />
                      </Col>
                    </Row>              
                    <Row>
                      <Col xs="12">
                          <FieldDocTitle error={touched.docTitle && errors.docTitle} onChange={handleChange}   value={values.docTitle}  />
                      </Col>
                    </Row>
                     <Row>
                      <Col xs="6">
                          <FieldDocOfficialDate  onChange={handleChange}  value={values.docOfficialDate}  />
                      </Col>
                      <Col xs="6">
                          <FieldDocNumber  onChange={handleChange} value={values.docNumber} />
                      </Col>
                    </Row>
                </CardBody>
                <CardFooter>
                    <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Next</Button>
                    { " " }
                    <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
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
