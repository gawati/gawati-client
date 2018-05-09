import React from 'react';
import axios from 'axios';
import { apiUrl } from '../../api';
import {Card, CardBody, CardFooter, Row, Col, Button} from 'reactstrap';

import {T} from '../../utils/i18nHelper';
import {getDocTypeFromLocalType} from '../../utils/DocTypesHelper';
import { isEmpty} from '../../utils/GeneralHelper';
import { aknExprIriThis } from '../../utils/UriHelper.js'
import { notifyWarning } from '../../utils/NotifHelper';

import FieldDocLanguage from './FieldDocLanguage2';
import FieldIri from './FieldIri';
import FieldDocCountry from './FieldDocCountry';
import FieldDocNumber from './FieldDocNumber';
import FieldDocTitle from './FieldDocTitle';
import FieldDocType from './FieldDocType';
import FieldDate from './FieldDate';
import FieldDocPart from './FieldDocPart';

import StatefulForm from './StatefulForm';

import '../../css/IdentityMetadata.css';

/**
 * Handlers for this form
 */
import { formHasErrors } from './DocumentForm.formUtils';

/**
 * This needs to be converted to use the baseformHOC
 */
class IdentityMetadataForm extends React.Component {
/**
 * Creates an instance of IdentityMetadata.
 * @param {any} props 
 * @memberof IdentityMetadata
 */
    constructor(props) {
      super(props);
      this.state = {
        preSave: false
      }
      this.parentContext = props.parentContext;
      this.validationSchema = props.validationSchema ; 
      // lang={lang} mode={mode} pkg={pkgIdentity}
      // const {lang, mode, pkg, isSubmitting} = props;
    } 

    /**
     * Check the errors in the form on load
     */
    componentDidMount(){
    }

    /**
     * Only for new documents i.e. 'Add Document'
     * Checks if the document with the iri already exists on
     * the client data server.
     */
    preSaveCheck = (formValid, mode) => {
      if (formValid && mode === 'add') {
        const {pkgIdentity: form} = this.props.pkg;
        const {generateIRI} = this.props;
        if (form.docIri.value) {
            const iri = aknExprIriThis(generateIRI(form), form.docPart.value);
            axios.post(
                apiUrl('document-exists'), {
                data: {"iri": iri}
                }
            )
            .then(response => {
                const preSave = (response.data === 'doc_not_found');
                if (!preSave) {
                  notifyWarning(T("A document with the same name already exists."));
                }
                //Set only if different. Otherwise it keeps rerendering since preSaveCheck is called in the render() method.
                if (this.state.preSave !== preSave) {
                  this.setState({preSave});
                }
            })
            .catch(err => {
                console.log(" Error in document-exists ", err);
                //Set only if not already false.
                if (this.state.preSave) {
                  this.setState({preSave: false});
                }
                throw err;
            });
        }
      }
    }

    /**
     * Wrapper on validateFormField passed in as a prop
     */
    validateFormField = (field, value) => {
      return this.props.validateFormField(this.validationSchema, field, value);
    }

    updateIriValue = (form) => {
        return  this.props.updateIriValue(form);
    }

    getSaveDisabled = (formValid) => {
      const {mode, isSubmitting} = this.props;
      const {preSave} = this.state;
      if (mode === 'add') {
        return isSubmitting || !formValid || !preSave;
      } else {
        return isSubmitting || !formValid;
      }
    }

    render() {
      const {handleSubmit, handleReset, mode} = this.props ; 
      const {pkgIdentity: form} = this.props.pkg ; 
      const errors = formHasErrors(form);
      console.log(" FORM VALUES = ", form);
      const formValid = isEmpty(errors);
      this.preSaveCheck(formValid, mode);

      return (
        <StatefulForm ref="identityForm" onSubmit={handleSubmit} noValidate>
        <Card className="doc-form-card">
          <CardBody>
            <Row>
            <Col xs="3" />
            <Col xs="6">
                <FieldIri form={form} formValid={formValid}  />
            </Col>
            <Col xs="3" />
            </Row>
            <Row>
              <Col xs="4">
                <FieldDocCountry value={form.docCountry.value} readOnly={ mode === "edit" }
                        onChange={
                          (evt)=> {
                            this.validateFormField(
                              "docCountry", 
                              evt.target.value
                            );
                            //update the IRI displayed on the page
                            this.updateIriValue(form);
                          }
                        }  
                        error={errors.docCountry}
                      />
                </Col>
                <Col xs="4">
                    <FieldDocType name="docType"
                      value={form.docType.value} 
                      readOnly={ mode === "edit" || mode === "add" }
                      onChange={
                        (evt)=> {
                          const fieldValue = evt.target.value ;
                          this.validateFormField(
                            'docType',
                            fieldValue
                          );
                          this.validateFormField(
                            'docAknType',  
                            fieldValue !== "" ? getDocTypeFromLocalType(fieldValue).aknType : ""
                          );
                          this.updateIriValue(form);                              }
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
                    label={T("Language")}
                    readOnly={ mode === "edit" }
                    onChange={
                        (field, value) => {
                          // we set an empty object as the default for validation since 
                          // we have specified an object as neccessary for the schema.
                          this.validateFormField(field, value === null ? {}: value);
                          this.updateIriValue(form);
                        }
                      }
                    value={form.docLang.value}
                    error={errors.docLang}
                      />
                </Col>
              </Row>              

              <Row>
                <Col xs="4">
                    <FieldDate  
                      value={form.docOfficialDate.value} 
                      readOnly={ mode === "edit" }
                      name="docOfficialDate"
                      label={T("Official Date")}
                      onChange={
                        (field, value)=> {
                          this.validateFormField(field, value);
                          this.updateIriValue(form);
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
                          this.updateIriValue(form);
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
                        this.validateFormField('docPart', val);
                        this.updateIriValue(form);
                      }
                    }
                    error={errors.docPart}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FieldDate  
                      value={form.docPublicationDate.value} 
                      readOnly={ false }
                      name="docPublicationDate"
                      label={T("Publication Date")}
                      onChange={
                        (field, value)=> {
                          this.validateFormField(field, value);
                        }
                      }
                      error={errors.docPublicationDate}
                    />
                </Col>
                <Col xs="6">
                  <FieldDate  
                      value={form.docEntryIntoForceDate.value} 
                      readOnly={ false }
                      name="docEntryIntoForceDate"
                      label={T("Entry Into Force Date")}
                      onChange={
                        (field, value)=> {
                          this.validateFormField(field, value);
                        }
                      }
                      error={errors.docEntryIntoForceDate}
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
              { " " }
              <Button type="submit"  name="btnSubmit" size="sm" color="primary" disabled={this.getSaveDisabled(formValid)}><i className="fa fa-dot-circle-o"></i> Save</Button>
              { " " }
              <Button type="reset" size="sm" disabled={ mode === "edit" } color="danger" onClick={handleReset}><i className="fa fa-ban"></i> Reset</Button>
            </CardFooter>
        </Card>
      </StatefulForm>
    );
    }
}

export default IdentityMetadataForm;