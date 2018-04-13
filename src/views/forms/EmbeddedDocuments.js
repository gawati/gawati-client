import React from 'react';
import { Breadcrumb, BreadcrumbItem, Label, Card, CardHeader, CardBody, CardFooter, Row, Col, Button} from 'reactstrap';

import axios from 'axios';


import { isEmpty, capitalizeFirst } from '../../utils/GeneralHelper';
import { getCrumbLinks } from '../../utils/RoutesHelper';

import StatefulForm from './StatefulForm';
import loadbaseForm from './baseFormHOC';

import '../../css/IdentityMetadata.css';
import FileUpload from './FileUpload';
import {dataProxyServer} from '../../constants';
import uuid from 'uuid';
import { iriDate } from '../../utils/DateHelper';

import StdCompContainer from '../../components/general/StdCompContainer';
import "../../css/custom.css";

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
        docs: [  ]
      };
      /*     
      docs =  [{
          "key": key, 
          "file": null, 
          "fileName": '',
          "title": '',
          "fileType": ''
      } ] ;

      */
      //this.uploadControls = [];
      console.log(" PROPS>IRI", this.props.iri, this.props.match);
      /** 
       * This provides validation of each field value using Yup
       * The validator function is declared in Yup syntax here, and
       * applied in the onChange of the field. 
       */
      //this.validationSchema = validationSchema() ; //validationSchema();
      // bindings
      this.handleAddMore = this.handleAddMore.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      //this.handleReset = this.handleReset.bind(this);
    }




    /**
     * Check the errors in the form on load
     */
    componentDidMount(){
      // get the iri 
      const { iri } = this.props.match.params;
      this.setState({ isSubmitting: true });
      // load the form state in the HOC which in turn sets the form prop
      this.props.loadFormWithDocument( iri )
            .then( (response) => {
                // the form prop should be set correctly here
                console.log(" FORM PROPS CDM = ", this.props.form);
                this.setState({ isSubmitting: false });
            });
    }



    handleSubmit(event) {
        event.preventDefault();
        console.log (" EVENT> TARGET ", this.docsForm, event.target);
        let formData = new FormData(event.target);
        console.log(" FORM DATA = ", formData);
        var data = new FormData();
        this.state.docs.forEach( (doc, index) => {
            console.log(` ITEM  ${index} `, doc);
            if (doc.file) {
              /*
                "key": key, 
                "file": null, 
                "fileName": '',
                "title": '',
                "fileType": ''
              */
            if (doc.title) {
              data.append(`file_${index}`, doc.file);
              data.append(`fileName_${index}`, doc.fileName);
              data.append(`title_${index}`, doc.title);
              data.append(`fileType_${index}`, doc.fileType);
              data.append(`key_${index}`, doc.key);
            }
          }
        });

        // add document metadata to submit formData
        for (let field in this.props.form) {
           let formField = this.props.form[field];
           console.log(" docLang ",  this.props.form['docLang']);
           if (field === 'docOfficialDate') {
              let offDate = iriDate(formField.value);
              console.log(" OFFICIAL DATE = ", offDate);
              data.append(field, JSON.stringify({value: offDate}));
           } else {
              data.append(field, JSON.stringify({value: formField.value}));
           }
        }
        axios.post(
          dataProxyServer() + '/gwc/document/upload', data, {
            headers: { "X-Requested-With": "XMLHttpRequest" }
          }
          )
        .then(
          (response) => {
            this.setState({isSubmitting: false});
            console.log(" RESPONSE >  DATA ", response.data);
            //handleSuccess(response.data);
          }
        )
        .catch(
          (err) => {
            this.setState({isSubmitting: false});
            console.log(" ERROR RESPONSE ", err);
            //handleApiException(err);
          }
        );
    };

    handleAddMore(event) {
      event.preventDefault();
      let {docs} = this.state ;
      let key = uuid.v1();
      let doc = {
          "key": key, 
          "file": null, 
          "fileName": '',
          "title": '',
          "fileType": ''
      };
      let newDocs = [...docs, doc];
      this.setState({docs: newDocs });
    }

    handleRemove(event, findThisKey) {
      let {docs} = this.state ; 
      let newDocs = docs.filter((item) => item.key !== findThisKey );
      //this.uploadControls  = this.uploadControls.filter( (item) => item.key !== findThisKey);
      this.setState({docs: newDocs});
    }

    getDocIndex(key) {
      return this.state.docs.findIndex( (item) => item.key === key );
    }

    renderDoc = (doc) => {
      const {key, file, fileName, fileType, title} = doc; 
      return(
      <FileUpload  
        commonkey={key}
        fileValue={file}
        title={title}
        fileType={fileType}
        fileName={fileName}
        getDocIndex={this.getDocIndex.bind(this)}
        onChangeFile={ 
          (evt) => {
              let index = this.state.docs.findIndex( (item) => item.key === key );
              if (index !== -1) {
                let theDoc = {};
                theDoc.key =  this.state.docs[index].key ;
                theDoc.title = this.state.docs[index].title ;
                theDoc.file = evt.target.files[0]; 
                theDoc.fileName = evt.target.files[0].name;
                theDoc.fileType = evt.target.files[0].type ;
                let newDocs = [...this.state.docs];
                newDocs.splice(index, 1, theDoc);
                this.setState({docs: newDocs});
              }
            } 
        }   
        onChangeFileTitle={
            (evt) => {
              let index = this.state.docs.findIndex( (item) => item.key === key );
              if (index !== -1) {
                let item = Object.assign({}, this.state.docs[index]);
                item.title = evt.target.value ; 
                let newDocs = [...this.state.docs];
                newDocs.splice(index, 1, item);
                this.setState({ docs: newDocs });
              }
            }
        }
      />);
    }

    renderDocs = () =>                       
        this.state.docs.map(
          (doc, index) => {
            return (
              <Row key={doc.key}>
              <Col xs="12">
                <Card>
                  <CardHeader>
                    { index + 1 }.
                    <Label className="float-right mb-0">
                    <Button type="reset" size="sm" 
                      onClick={ (e) => this.handleRemove(e, doc.key)} color="danger">
                        <i className="fa fa-minus-circle"></i> Remove</Button>
                    </Label>
                  </CardHeader>
                  <CardBody>
                  {this.renderDoc(doc)}
                  </CardBody>
                </Card>
              </Col>
            </Row> 
            );
          }
        )
        ; 

    renderMetadata(form) {
      return (
        <ul className="list-inline custom-list">
          <li className="list-inline-item"><span>Title <b>{ form.docTitle.value }</b></span></li>
          <li className="list-inline-item"><span>Type <b>{ form.docType.value }</b></span></li>
          <li className="list-inline-item"><span>Language <b>{ form.docLang.value.value }</b></span></li>
          <li className="list-inline-item"><span>Document # <b>{ form.docNumber.value }</b></span></li>
          <li className="list-inline-item"><span>IRI <b>{ form.docIri.value }</b></span></li>
        </ul>
      )
    }

    renderAttForm() { 
      const {isSubmitting} = this.state ; 
      const { mode, form} = this.props;
      const errors = this.props.formHasErrors();
      const formValid = isEmpty(errors);
      return (
        <div >
            <Card className="bg-white text-right mt-1 mb-1">
              <CardBody className="pt-0 pb-0">
              <Button type="button" onClick={this.handleAddMore}  name="btn" size="sm" color="primary" ><i className="fa fa-plus"></i> Add File</Button>                
              </CardBody>
            </Card>        
            <StatefulForm encType="multipart/form-data" ref="docsForm" onSubmit={this.handleSubmit} noValidate>
            <Card>
                <CardHeader>
                    <strong>Components</strong>
                    <small> Form</small>
                </CardHeader>
                <CardBody>
                    {this.renderMetadata(form)}
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

    /**
     * @memberof EmbeddedDocuments
     */
    getBreadcrumb = () => {
      let title = this.props.form.docTitle.value;
      let type = this.props.form.docAknType.value;
      let crumbLinks = getCrumbLinks("document-comp-open", this.props.match.params)
      return (
        <Breadcrumb>
          <BreadcrumbItem><a href={crumbLinks[0]}>Home</a></BreadcrumbItem>
          <BreadcrumbItem><a href={crumbLinks[0]}>{capitalizeFirst(type)}</a></BreadcrumbItem>
          <BreadcrumbItem><a href={crumbLinks[1]}>Identity</a></BreadcrumbItem>
          <BreadcrumbItem active>{title}</BreadcrumbItem>
        </Breadcrumb>
      );
    }
    
    render() {
      const breadcrumb = this.getBreadcrumb();
      return (
        <StdCompContainer breadcrumb={breadcrumb} >
          {this.renderAttForm()}
        </StdCompContainer>
      );
    }
}


export default loadbaseForm()(EmbeddedDocuments);
