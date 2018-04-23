import React from 'react';
import {Card, CardHeader, CardBody, CardFooter, Row, Col, Button, Label, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import {T} from '../../utils/i18nHelper';
import StdCompContainer from '../../components/general/StdCompContainer';

import FileUpload1 from './FileUpload1';
import {MAX_ATTACHMENTS} from '../../constants';
import StatefulForm from './StatefulForm';
import { notifyWarning } from '../../utils/NotifHelper';

/**
 * To-Do:
 * a. Remove Attachments functionality.
 * b. Remove next -> components button at the bottom from IdentityMetadata page.
 *    It is broken.
 */

/**
 * This needs to be converted to use the baseformHOC
 */
class EmbeddedDocumentsForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { attModal: false }
    }

    handleRemoveAtt(e, emDoc) {
        alert("Removed attachment");
    }

    toggleAttModal() {
        this.setState({ attModal: !this.state.attModal });
    }

    handlePostSave() {
        this.setState({ attModal: false });
        this.props.reload();
    }

    handleAddMore(event) {
        const {pkgAttachments: attachments} = this.props.pkg ;
        if (attachments.length === MAX_ATTACHMENTS) {
          notifyWarning("Maximum number of attachments reached");
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
        const {mode} = this.props;
        const {pkgAttachments: attachments, pkgIdentity: form} = this.props.pkg ;
        return (
            <div >
                <Card className="bg-white text-right mt-1 mb-1">
                    <CardBody className="pt-0 pb-0">
                    <Button type="button" onClick={this.handleAddMore.bind(this)}  name="btn" size="sm" color="primary" ><i className="fa fa-plus"></i> Add File</Button>
                    </CardBody>
                </Card>        
                <StatefulForm encType="multipart/form-data" ref="docsForm" noValidate>
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