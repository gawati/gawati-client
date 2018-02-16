import React from 'react';
import { Label, Card, CardHeader, CardBody, CardFooter, Row, Col, Button} from 'reactstrap';

import axios from 'axios';
import moment from 'moment';

import { isEmpty } from '../../utils/generalhelper';
import {getDocTypeFromLocalType} from '../../utils/doctypeshelper';
import { isInvalidValue } from '../../utils/generalhelper';
import { aknExprIri, aknWorkIri, normalizeDocNumber, unknownIriComponent } from '../../utils/urihelper';
import { iriDate, isValidDate } from '../../utils/datehelper';

import FieldIri from './FieldIri';

import StatefulForm from './StatefulForm';


import '../../css/IdentityMetadata.css';
import { apiUrl } from '../../api';
import FileUpload from './FileUpload';
import uuid from 'uuid';

class EmbeddedDocuments extends React.Component {

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
        form: {} ,
        docs: [  ]
      };
      /** 
       * This provides validation of each field value using Yup
       * The validator function is declared in Yup syntax here, and
       * applied in the onChange of the field. 
       */
      this.validationSchema = {} ; //validationSchema();
      // bindings
      this.handleAddMore = this.handleAddMore.bind(this);
      //this.handleSubmit = this.handleSubmit.bind(this);
      //this.handleReset = this.handleReset.bind(this);
    }




    /**
     * Check the errors in the form on load
     */
    componentDidMount(){
      const promise = this.loadFormWithDocument();
    }



    loadFormWithDocument = () => {
      let {lang, iri} = this.props ; 
      //this.setState({isSubmitting: true});
      iri = iri.startsWith("/") ? iri : `/${iri}` ;
      let docOpen = axios.post(
          apiUrl('document-open'), {
            data: {"iri": iri}
          }
        );
      docOpen
        .then(
          (response) => {
              //console.log(" response.data ", response);
              let aknDoc = response.data.akomaNtoso; 
              aknDoc.docOfficialDate.value = moment(aknDoc.docOfficialDate.value, "YYYY-MM-DD", true).toDate();
              //this.setState({
              //  isSubmitting: false,
              //  form: aknDoc
              //});
          }
        )
        .catch(
          (err) => {
            this.setState({isSubmitting: false});
            //handleApiException(err);
          }
        );
      return docOpen;
    };

    handleAddMore(event) {
      event.preventDefault();
      let {docs} = this.state ;
      let doc = {"key": uuid.v1(), "value": <FileUpload />} ;
      let newDocs = [...docs, doc];
      this.setState({docs: newDocs });
    }

    handleRemove(event, findThisKey) {
      let {docs} = this.state ; 
      let newDocs = docs.filter((item) => item.key !== findThisKey );
      this.setState({docs: newDocs});
    }
 
    renderDocs = () =>                       
        this.state.docs.map(
          (item, index) => 
            <Row key={item.key}>
              <Col xs="12">
                <Card>
                  <CardHeader>
                    { index + 1 }.
                    <Label className="float-right mb-0">
                    <Button type="reset" size="sm" onClick={ (e) => this.handleRemove(e, item.key)} color="danger"><i className="fa fa-minus-circle"></i> Remove</Button>
                    </Label>
                  </CardHeader>
                  <CardBody>
                  {item.value}
                  </CardBody>
                </Card>
              </Col>
            </Row> 
        )
        ; 

    renderAttForm() { 
      const {isSubmitting, form} = this.state ; 
      const {mode} = this.props ;
      const errors = this.formHasErrors();
      const formValid = isEmpty(errors);
      return (
        <div >
            <Card className="bg-white text-right mt-1 mb-1">
              <CardBody className="pt-0 pb-0">
              <Button type="button" onClick={this.handleAddMore}  name="btn" size="sm" color="primary" ><i className="fa fa-plus"></i> Add File</Button>                
              </CardBody>
            </Card>        
            <StatefulForm ref="docsForm" onSubmit={this.handleSubmit} noValidate>
            <Card>
                <CardHeader>
                    <strong>Components</strong>
                    <small> Form</small>
                </CardHeader>
                <CardBody> 
                    { 
                     this.state.docs.length === 0 ? 
                      "There are no file attachments yet, you can use Add File to add an attachment" :
                      this.renderDocs()
                    }
                </CardBody>
                <CardFooter>
                    <Button type="submit"  name="btnSubmit" size="sm" color="primary" disabled={isSubmitting || !formValid}><i className="fa fa-dot-circle-o"></i> Save</Button>
                    { " " }
                    <Button type="submit" name="btnNext" size="sm" 
                      color="primary" disabled={isSubmitting || !formValid}
                      onClick={ 
                        (evt) => {
                          this.setNextClicked();
                         }
                       }
                      >
                      <i className="fa fa-chevron-right"></i> Next
                    </Button>
                    { " " }
                    <Button type="reset" size="sm" disabled={ mode === "edit" } color="danger" onClick={this.handleReset}><i className="fa fa-ban"></i> Reset</Button>
                  </CardFooter>
            </Card>
          </StatefulForm>
      </div>
    );
    }
    
    render() {
      const {docs} = this.state ; 
      return this.renderAttForm();
    }
}


export default EmbeddedDocuments;
