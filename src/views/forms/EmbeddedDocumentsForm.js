import React from 'react';
import {Card, CardHeader, CardBody, CardFooter, Row, Col, Button} from 'reactstrap';
import uuid from 'uuid';

import {T} from '../../utils/i18nHelper';
import StdCompContainer from '../../components/general/StdCompContainer';
import {getDocTypeFromLocalType} from '../../utils/DocTypesHelper';
import { isEmpty} from '../../utils/GeneralHelper';
import {embeddedDocumentsValidationSchema} from './DocumentForm.formConfig';

import {MAX_ATTACHMENTS} from '../../constants';

import StatefulForm from './StatefulForm';

import '../../css/IdentityMetadata.css';

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
    } 
  
      /**
       * Wrapper on validateFormField passed in as a prop
       */
    validateFormField = (field, value) => {
        return this.props.validateFormField(this.validationSchema, field, value);
    }

    handleAddMore(event) {
        if (this.props.form.docComponents.value.length === MAX_ATTACHMENTS) {
          alert("Maximum number of attachments reached");
        } else {
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
      }
  
  

    renderAttForm = () => {
        const {handleSubmit, handleReset, mode, isSubmitting} = this.props ; 
        const {pkgAttachments: form} = this.props.pkg ; 
        const errors = formHasErrors(form);
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

    render = () => {
        return this.renderAttForm();
    }
  
};

export default EmbeddedDocumentsForm;