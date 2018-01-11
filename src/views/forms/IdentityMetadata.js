import React from 'react';
import {Form, Card, CardHeader, CardBlock, CardBody, CardFooter, Row, Col, FormGroup, Label, Input, Button} from 'reactstrap';
import { Formik } from 'formik';

import StdDiv from '../../components/StdDiv';
import InputDate from '../../components/InputDate';

const FieldDocLanguage = ({onChange}) =>
  <FormGroup>
  <Label htmlFor="docLang">Language</Label>
  <Input type="select" name="docLang" onChange={onChange} defaultValue="" id="doclang" required>
    <option value="" disabled >Select a Language</option>
    <option value="eng">English</option>
    <option value="fra">French</option>
    <option value="por">Portoguese</option>
    <option value="spa">Spanish</option>
    <option value="mul">Multilingual</option>
  </Input>
  </FormGroup>;

const FieldDocType = ({onChange}) =>
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

const FieldDocCountry = ({onChange}) =>
  <FormGroup>
  <Label htmlFor="docCountry">Country</Label>
  <Input type="select" defaultValue=""  onChange={onChange} name="docCountry" id="country" required>
  <option value="" disabled >Select a Country</option>
    <option value="ke">Kenya</option>
    <option value="tz">Tanzania</option>
    <option value="ng">Nigeria</option>
    <option value="ao">Angola</option>
  </Input>
  </FormGroup>;

const FieldDocTitle = ({onChange}) =>
  <FormGroup>
    <Label htmlFor="docTitle">Title</Label>
    <Input type="text" name="docTitle"  onChange={onChange} id="doctitle" placeholder="Enter the Title of the document" required/>
  </FormGroup>;

const FieldDocOfficialDate = ({onChange}) =>
  <FormGroup>
    <Label htmlFor="docOfficialDate">Official Date</Label>
    <InputDate name="docOfficialDate" onChange={onChange} initialValue={ null } required />
  </FormGroup>;

const FieldDocNumber = ({onChange}) =>
  <FormGroup>
    <Label htmlFor="docNumber">Document Number</Label>
    <Input type="text" id="docNumber"  onChange={onChange} placeholder="Enter the official document number" required/>
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

    handleSubmit = (event) => {
      event.preventDefault();
      this.FORM_FIELD_NAMES.map( 
        name => console.log(` FIELD ${name}  ${event.target[name].value} `) );
    }

    handleDefaultChange = (event) => {
      console.log(" CHANGE ", event.target);
      if (!event.target.value) {
        this.setState({error: true});
      }
    }

    render() {
        return (
      <Form onSubmit={this.handleSubmit} noValidate>
        <Card>
            <CardHeader>
                <strong>Document Identity</strong>
                <small> Form</small>
            </CardHeader>
            <CardBody>
            <Row>
                <Col xs="4">
                    <FieldDocLanguage onChange={this.handleDefaultChange} />
                  </Col>
                  <Col xs="4">
                      <FieldDocType onChange={this.handleDefaultChange} />
                  </Col>
                  <Col xs="4">
                      <FieldDocCountry onChange={this.handleDefaultChange} />
                  </Col>
                </Row>              
                <Row>
                  <Col xs="12">
                      <FieldDocTitle onChange={this.handleDefaultChange} />
                  </Col>
                </Row>
                 <Row>
                  <Col xs="6">
                      <FieldDocOfficialDate onChange={this.handleDefaultChange} />
                  </Col>
                  <Col xs="6">
                      <FieldDocNumber onChange={this.handleDefaultChange} />
                  </Col>
                </Row>
            </CardBody>
            <CardFooter>
                <Button type="submit" disabled={this.state.error} size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Next</Button>
                { " " }
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
        </Card>
       </Form>
        );
    }
}


export default IdentityMetadata;