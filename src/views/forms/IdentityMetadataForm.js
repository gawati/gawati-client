import React from 'react';
import {Card, CardBody, CardFooter, Row, Col, Button} from 'reactstrap';

import {T} from '../../utils/i18nHelper';
import {getDocTypeFromLocalType} from '../../utils/DocTypesHelper';
import { isEmpty} from '../../utils/GeneralHelper';
import {fixTime} from '../../utils/DateHelper';

import FieldDocLanguage from './FieldDocLanguage2';
import FieldIri from './FieldIri';
import FieldDocCountry from './FieldDocCountry';
import FieldDocNumber from './FieldDocNumber';
import FieldDocTitle from './FieldDocTitle';
import FieldDocTags from './FieldDocTags';
import FieldDocType from './FieldDocType';
import FieldDate from './FieldDate';
import FieldDocPart from './FieldDocPart';
import PromptDocVersionDate from './PromptDocVersionDate';
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
        versionOpen: false
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
     * Wrapper on validateFormField passed in as a prop
     */
    validateFormField = (field, value) => {
      return this.props.validateFormField(this.validationSchema, field, value);
    }

    updateIriValue = (form) => {
        return  this.props.updateIriValue(form);
    }

    updateVersion = (docVersionDate) => {
      const {pkgIdentity: form} = this.props.pkg;
      this.setState({versionOpen: false});
      this.updateIriValue(form);
      this.props.updateVersion(docVersionDate);
    }

    renderVersionPrompt() {
        const {mode} = this.props;
        const isOpen = mode === "edit" && this.state.versionOpen;
        const {pkgIdentity: form} = this.props.pkg;
        const curDates = {
          officialDate: form.docOfficialDate.value,
          versionDate: form.docVersionDate.value,
        }
        return (
            <PromptDocVersionDate isOpen={isOpen} curDates={curDates}
                                  validationSchema={this.validationSchema} sendDocVersionDate={this.updateVersion.bind(this)}/>
        );
    }

    renderVersionDate(form, errors) {
      const {mode} = this.props;
      const {docVersionDate, docOfficialDate} = form;
      const isLater = new Date(docVersionDate.value) > new Date(docOfficialDate.value);

      if (mode === 'edit' && isLater) {
          return (
          <Row>
            <Col xs="4">
              <FieldDate
                value={docVersionDate.value}
                readOnly={ true }
                name="docVersionDate"
                label={T("Version Date")}
                error={errors.docOfficialDate}
              />
            </Col>
          </Row>
        );
      } else {
        return '';
      }
    }

    render() {
      const {handleSubmit, handleReset, mode, isSubmitting} = this.props ; 
      const {pkgIdentity: form} = this.props.pkg ; 
      const errors = formHasErrors(form);
      console.log(" FORM VALUES = ", form);
      const formValid = isEmpty(errors);

      if(mode === "view") {
        var Footer = <div></div>
      }else{

        Footer = <div> 
                 { " " }
                   <Button type="submit"  size="sm" color="primary" disabled={isSubmitting || !formValid}><i className="fa fa-floppy-o"></i> Save</Button>
                 { " " }
                   <Button type="reset" size="sm" disabled={ mode === "edit" } color="danger" onClick={handleReset}><i className="fa fa-ban"></i> Reset</Button>
                 { " " }
                   <Button type="button" size="sm" disabled={ isSubmitting || !formValid || mode === "add" } color="info" onClick={() => {this.setState({versionOpen: true})}}><i className="fa fa-dot-circle-o"></i> New Legal Version</Button>
                 </div>
      }

      return (
        <StatefulForm ref="identityForm" onSubmit={handleSubmit} noValidate>
        {this.renderVersionPrompt()}
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
                <FieldDocCountry value={form.docCountry.value} readOnly={ mode === "edit" || mode === "view" }
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
                      readOnly={ mode === "edit" || mode === "add" || mode === "view"}
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
                    readOnly={ mode === "edit" || mode === "view" }
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
                      readOnly={ mode === "edit" || mode === "view"}
                      name="docOfficialDate"
                      label={T("Official Date")}
                      onChange={
                        (field, value)=> {
                          // we fix the time to avoid timezone issues
                          let fixedValue = fixTime(value);
                          // we set docVersionDate = docOfficialDate when a new document is being created 
                          this.validateFormField('docVersionDate', fixedValue)
                          this.validateFormField(field, fixedValue);
                          this.updateIriValue(form);
                        }
                      }
                      error={errors.docOfficialDate}
                    />
                </Col>
                <Col xs="4">
                    <FieldDocNumber value={form.docNumber.value}
                      readOnly={ mode === "edit" || mode === "view"}
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
                    readOnly={ mode === "edit" || mode === "view"}
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

              {this.renderVersionDate(form, errors)}

              <Row>
                <Col xs="6">
                  <FieldDate  
                      value={form.docPublicationDate.value} 
                      readOnly={ mode === "view" }
                      name="docPublicationDate"
                      label={T("Publication Date")}
                      onChange={
                        (field, value)=> {
                          // we fix the time to avoid timezone issues
                          this.validateFormField(field, fixTime(value));
                        }
                      }
                      error={errors.docPublicationDate}
                    />
                </Col>
                <Col xs="6">
                  <FieldDate  
                      value={form.docEntryIntoForceDate.value} 
                      readOnly={ mode === "view" }
                      name="docEntryIntoForceDate"
                      label={T("Entry Into Force Date")}
                      onChange={
                        (field, value)=> {
                          // we fix the time to avoid timezone issues
                          this.validateFormField(field, fixTime(value));
                        }
                      }
                      error={errors.docEntryIntoForceDate}
                    />
                </Col>
              </Row>
              <Row>
                <Col xs="12">
                    <FieldDocTitle value={form.docTitle.value}
                      readOnly = { mode === "view"}
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
                <Col xs="12">
                    <FieldDocTags value={form.docTags.value || ' '}
                                  onClick={this.props.refreshTags}
                                  disabled={isSubmitting}
                    />
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              {Footer} 
            </CardFooter>
        </Card>
      </StatefulForm>
    );
    }
}

export default IdentityMetadataForm;