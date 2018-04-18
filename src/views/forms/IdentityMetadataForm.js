import React from 'react';
import {Card, CardHeader, CardBody, CardFooter, Row, Col, Button} from 'reactstrap';

import {T} from '../../utils/i18nHelper';
import {getDocTypeFromLocalType} from '../../utils/DocTypesHelper';
import { isEmpty} from '../../utils/GeneralHelper';

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
import { formHasErrors, setFieldValue, generateIRI, validateFormField } from './DocumentForm.formUtils';

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
      this.validationSchema = props.validationSchema ; 
      // lang={lang} mode={mode} pkg={pkgIdentity}
      // const {lang, mode, pkg, isSubmitting} = props;
    } 

    updateIriValue = (form) => {
      setFieldValue(this, "docIri", generateIRI(form));
    };

    /**
     * Check the errors in the form on load
     */
    componentDidMount(){
    }

    render() {
      const {handleSubmit, handleReset, mode, isSubmitting} = this.props ; 
      const {pkgIdentity: form} = this.props.pkg ; 
      const errors = formHasErrors(form);
      const formValid = isEmpty(errors);
      return (
        <StatefulForm ref="identityForm" onSubmit={handleSubmit} noValidate>
        <Card>
          <CardHeader>
              <strong>Document Identity</strong>
              <small> Form</small>
          </CardHeader>
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
                            validateFormField(this, this.validationSchema, "docCountry", evt.target.value);
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
                      readOnly={ mode === "edit" }
                      onChange={
                        (evt)=> {
                          const fieldValue = evt.target.value ;
                          validateFormField(
                            this, this.validationSchema, 
                            'docType',
                            fieldValue
                          );
                          validateFormField(
                            this, this.validationSchema, 
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
                          validateFormField(this, this.validationSchema, field, value === null ? {}: value);
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
                          validateFormField(this, this.validationSchema, field, value);
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
                          validateFormField(this, this.validationSchema, 'docNumber', evt.target.value);
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
                        validateFormField(this, this.validationSchema, 'docPart', val);
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
                          validateFormField(this, this.validationSchema, field, value);
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
                          validateFormField(this, this.validationSchema, field, value);
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
                            validateFormField(this, this.validationSchema, 'docTitle', evt.target.value);
                          }
                        }
                      error={errors.docTitle}
                    />
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button type="submit" name="btnNext" size="sm" 
                color="primary" disabled={isSubmitting || !formValid}
                onClick={ 
                  (evt) => {
                    this.setNextClicked();
                    }
                  }
                >
                <i className="fa fa-chevron-right"></i> Next - Components
              </Button>
              { " " }
              <Button type="submit"  name="btnSubmit" size="sm" color="primary" disabled={isSubmitting || !formValid}><i className="fa fa-dot-circle-o"></i> Save</Button>
              { " " }
              <Button type="reset" size="sm" disabled={ mode === "edit" } color="danger" onClick={handleReset}><i className="fa fa-ban"></i> Reset</Button>
            </CardFooter>
        </Card>
      </StatefulForm>
    );
    }
}

export default IdentityMetadataForm;