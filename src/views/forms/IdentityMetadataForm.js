import React from 'react';
import {Redirect} from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem, Card, CardHeader, CardBody, CardFooter, Row, Col, Button} from 'reactstrap';

import axios from 'axios';
import moment from 'moment';

import {T} from '../../utils/i18nHelper';
import {getDocTypeFromLocalType} from '../../utils/DocTypesHelper';
import { isEmpty, isInvalidValue, capitalizeFirst } from '../../utils/GeneralHelper';
import { aknExprIri, aknWorkIri, normalizeDocNumber, unknownIriComponent } from '../../utils/UriHelper';
import { setInRoute, getCrumbLinks } from '../../utils/RoutesHelper';
import { iriDate, isValidDate } from '../../utils/DateHelper';

import FieldDocLanguage from './FieldDocLanguage2';
import FieldIri from './FieldIri';
import FieldDocCountry from './FieldDocCountry';
import FieldDocNumber from './FieldDocNumber';
import FieldDocTitle from './FieldDocTitle';
import FieldDocType from './FieldDocType';
import FieldDate from './FieldDate';
import FieldDocPart from './FieldDocPart';

import StatefulForm from './StatefulForm';

import {formInitialState, validationSchema} from './identityMetadata.formConfig';

import '../../css/IdentityMetadata.css';
import { apiUrl } from '../../api';

/**
 * Handlers for this form
 */
import {handleApiException, handleSubmitAdd, handleSubmitEdit} from './identityMetadata.handlers';
import StdCompContainer from '../../components/general/StdCompContainer';
import DocActions from "../../components/DocActions";

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
      // lang={lang} mode={mode} pkg={pkgIdentity}
      const {lang, mode, pkg} = props;
      this.state = {
        isSubmitting: false,
        mode: props.mode
      };
    }


    /**
     * Check the errors in the form on load
     */
    componentDidMount(){
    }

    render() {
      return (
        <StatefulForm ref="identityForm" onSubmit={this.handleSubmit} noValidate>
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
                            this.validateFormField('docCountry', evt.target.value);
                            this.updateIriValue();
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
                          this.validateFormField('docType',fieldValue);
                          this.validateFormField(
                            'docAknType',  
                            fieldValue !== "" ? getDocTypeFromLocalType(fieldValue).aknType : ""
                          );
                          this.updateIriValue();                              }
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
                          this.updateIriValue();
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
                          this.updateIriValue();
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
                          this.updateIriValue();
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
                        this.updateIriValue();
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
              <Button type="reset" size="sm" disabled={ mode === "edit" } color="danger" onClick={this.handleReset}><i className="fa fa-ban"></i> Reset</Button>
            </CardFooter>
        </Card>
      </StatefulForm>
    );
    }
}


export default IdentityMetadataForm;

