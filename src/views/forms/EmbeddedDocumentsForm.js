import React from 'react';
import {Card, CardHeader, CardBody, CardFooter, Row, Col, Button, Label, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import uuid from 'uuid';

import {T} from '../../utils/i18nHelper';
import StdCompContainer from '../../components/general/StdCompContainer';
import {getDocTypeFromLocalType} from '../../utils/DocTypesHelper';
import { isEmpty} from '../../utils/GeneralHelper';
import {embeddedDocumentsValidationSchema} from './DocumentForm.formConfig';

import FileUpload1 from './FileUpload1';
import {MAX_ATTACHMENTS} from '../../constants';

import StatefulForm from './StatefulForm';

import '../../css/IdentityMetadata.css';

/**
 * To-Do:
 * a. Attach each FileUpload with an attachment. Updates should be linked
 *    to that emDoc.
 * b. Make 'Add File' a dialog box.
 * This will make the data flow one way and avoid maintaining another set of
 * UI attachments
 * c. Remove 'key' since indexes are sufficient.
 * d. Rename `index` to `id`?
 * e. Remove next -> components button at the bottom from IdentityMetadata page.
 * f. Reload `loadFormWithDocument` to get newly saved attachments
 */

/**
 * Handlers for this form
 */
import { formHasErrors } from './DocumentForm.formUtils';

/**
 * This needs to be converted to use the baseformHOC
 */
class EmbeddedDocumentsForm extends React.Component {

    constructor(props) {
        super(props);
        this.validationSchema = props.validationSchema ;
        this.state = { attModal: false }
    } 
  
      /**
       * Wrapper on validateFormField passed in as a prop
       */
    validateFormField = (field, value) => {
        return this.props.validateFormField(this.validationSchema, field, value);
    }

    handleAddMore(event) {
        const {pkgAttachments: attachments} = this.props.pkg ;
        if (attachments.length === MAX_ATTACHMENTS) {
          alert("Maximum number of attachments reached");
        } else {
          event.preventDefault();
          let newAtt = {
              "index": '',
              "fileName": '',
              "showAs": '',
              "fileType": ''
          };
          this.setState({newAtt: newAtt, attModal: true});
        }
      }
  
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

    handleRemoveAtt(e, emDoc) {
        alert("Removed attachment");
    }

    toggleAttModal() {
        this.setState({ attModal: !this.state.attModal });
    }

    handlePostSave() {
        this.setState({ attModal: false });
    }

    renderAttModal() {
        const form = this.props.pkg.pkgIdentity;
        return (
            <Modal isOpen={this.state.attModal} toggle={this.toggleAttModal.bind(this)}>
            <ModalHeader>Upload New Attachment</ModalHeader>
            <ModalBody>
                <FileUpload1 form={form} emDoc={this.state.newAtt} handlePostSave={this.handlePostSave.bind(this)} />
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={this.toggleAttModal.bind(this)}>Cancel</Button>
            </ModalFooter>
            </Modal>
        )
    }

    renderAttachment(emDoc) {
        const form = this.props.pkg.pkgIdentity;
        return(
            <FileUpload1 form={form} emDoc={emDoc} handlePostSave={this.handlePostSave.bind(this)} />
        );
    }

    renderAttachments(emDocs) {
        let attachments =
        emDocs.map(emDoc => {
            return (
                <Row key={emDoc.index}>
                <Col xs="12">
                    <Card>
                    <CardHeader>
                        { emDoc.index }. {emDoc.showAs}
                        <Label className="float-right mb-0">
                        <Button type="reset" size="sm"
                        onClick={ (e) => this.handleRemoveAtt(e, emDoc)} color="danger">
                            <i className="fa fa-minus-circle"></i> Remove</Button>
                        </Label>
                    </CardHeader>
                    <CardBody>
                    {this.renderAttachment(emDoc)}
                    </CardBody>
                    </Card>
                </Col>
                </Row>
            );
        });
        return attachments;
    }

    renderAttForm = () => {
        const {handleSubmit, handleReset, mode, isSubmitting} = this.props ; 
        const {pkgAttachments: attachments, pkgIdentity: form} = this.props.pkg ;
        const errors = formHasErrors(form);
        const formValid = isEmpty(errors);
        return (
            <div >
                <Card className="bg-white text-right mt-1 mb-1">
                    <CardBody className="pt-0 pb-0">
                    <Button type="button" onClick={this.handleAddMore.bind(this)}  name="btn" size="sm" color="primary" ><i className="fa fa-plus"></i> Add File</Button>
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
                            attachments.length === 0 ?
                            "There are no file attachments yet, you can use Add File to add an attachment" :
                            this.renderAttachments(attachments)
                        }
                        {this.renderAttModal()}
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

    render = () => {
        return this.renderAttForm();
    }
  
};

export default EmbeddedDocumentsForm;