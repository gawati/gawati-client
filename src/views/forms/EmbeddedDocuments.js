import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Row, Col, Button} from 'reactstrap';

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
        form: {}
      };
      /** 
       * This provides validation of each field value using Yup
       * The validator function is declared in Yup syntax here, and
       * applied in the onChange of the field. 
       */
      this.validationSchema = {} ; //validationSchema();
      // bindings
      //this.handleSubmit = this.handleSubmit.bind(this);
      //this.handleReset = this.handleReset.bind(this);
    }

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
     * Check the errors in the form on load
     */
    componentDidMount(){
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
          //handleApiException(err);
        }
      );
    };

 
 

    render() {
      const {isSubmitting, form} = this.state ; 
      const {mode} = this.props ;
      const errors = this.formHasErrors();
      const formValid = isEmpty(errors);
      return (
        <div >
            <StatefulForm ref="docsForm" onSubmit={this.handleSubmit} noValidate>
            <Card>
                <CardHeader>
                    <strong>Components</strong>
                    <small> Form</small>
                </CardHeader>
                <CardBody>
                <Row>
                    <Col xs="3">
                      </Col>
                      <Col xs="6">
                          This is some text
                      </Col>
                      <Col xs="3">
                      </Col>
                    </Row>
                    
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
}


export default EmbeddedDocuments;
