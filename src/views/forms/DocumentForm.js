import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import IdentityMetadataForm from './IdentityMetadataForm';
import EmbeddedDocumentsForm from './EmbeddedDocumentsForm';
import StdCompContainer from '../../components/general/StdCompContainer';
import {Aux} from '../../utils/GeneralHelper';
import {T} from '../../utils/i18nHelper';
import DocumentFormActions from './DocumentFormActions';

import 'react-tabs/style/react-tabs.css';

/*
* Form Related configs and util functions
*/
import {
    identityInitialState,
    identityValidationSchema
} from './DocumentForm.formConfig';
import {
    loadFormWithDocument,
    loadViewWithDocument,
    setFieldValue,
    validateFormFields,
    validateFormField,
    getBreadcrumb,
    generateIRI,
} from './DocumentForm.formUtils' ;
import { applyActionToState } from './DocumentForm.stateManager';
import { STATE_ACTION_RESET_IDENTITY, STATE_ACTION_IS_SUBMITTING, STATE_ACTION_IS_NOT_SUBMITTING } from './DocumentForm.constants';
import { handleSubmitEdit, handleSubmitAdd, handleRemoveAttachment } from './DocumentForm.handlers';
import { DocumentInfo } from './DocumentInfo';

/**
 * Expects the following props
 *  
 *  - @mode ``edit`` or ``add`` or ``view``
 *  - @iri in ``edit`` or ``view`` modes expects an IRI as a prop
 */
class DocumentForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isLoading: true,
          isSubmitting: false,
          documentLoadError: false,
          mode: props.mode,
          /* 
          form has field names as state values 
          i.e. docTitle has to have a corresponding 
          <input name="docTitle" .... /> in the form
          */ 
          pkg: {
            created: undefined,
            modified: undefined,
            pkgIdentity: identityInitialState(),
            pkgAttachments: [],
            workflow: {state: {status: 'draft', 'label': 'Draft'}},
            permissions: {}
          }
        };
        /** 
         * This provides validation of each field value using Yup
         * The validator function is declared in Yup syntax here, and
         * applied in the onChange of the field. 
         */
        this.identityValidationSchema = identityValidationSchema();
        // bindings
        //this.handleSubmit = this.handleSubmit.bind(this);
        //this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        const {mode} = this.props;
        if (mode === "edit") {
            // load iri date
            loadFormWithDocument(this);
        } else if (mode === "add") {
            // add mode ... validate empty form
            validateFormFields(this);
        } else {
            // mode === view 
            loadViewWithDocument(this);  
        }
    }

    updateIriValue = () => {
        console.log(" THIS UPDATEIRIVALUE = docIRI ", this.state);
        setFieldValue(this, "docIri", generateIRI(this.state.pkg.pkgIdentity));
    };

    validateFormField = (schema, field, value) => {
        return validateFormField(this, schema, field, value);
    }

    handleIdentityReset = () => {
        applyActionToState(this, {
            type: STATE_ACTION_RESET_IDENTITY, 
            params: {}
        });
    };

    handleIdentitySubmit = (evt) => {
        console.log("IN: handleIdentitySubmit ", evt);
        const {mode} = this.props;
        evt.preventDefault();
        applyActionToState(this, {type: STATE_ACTION_IS_SUBMITTING});
        if (mode === "edit") {
            handleSubmitEdit(this, this.state.pkg)
            return;
        }
        if (mode === "add") {
          handleSubmitAdd(this, this.state.pkg);
          return;
        }
    }

    /**
     * Set `isSubmitting`
     * @val Boolean
     */
    setSubmitting = (val) => {
        if (val) {
            applyActionToState(this, {type: STATE_ACTION_IS_SUBMITTING});
        } else {
            applyActionToState(this, {type: STATE_ACTION_IS_NOT_SUBMITTING});
        }
    }

    reloadAttachments = () => {
        loadFormWithDocument(this);
    }

    handleRemoveAttachment = (data) => {
        applyActionToState(this, {type: STATE_ACTION_IS_SUBMITTING});
        handleRemoveAttachment(this, data, this.reloadAttachments);
        return;
    }


    render() {
        const {match, mode} = this.props;
        const {lang} = match.params;
        const {pkg, isSubmitting, isLoading} = this.state ;

        const breadcrumb = getBreadcrumb(this, isLoading);

        console.log(" RENDER_STATE == ", this.state);
        if (isLoading) {
            return (
              <StdCompContainer breadcrumb={breadcrumb} isLoading={isLoading}>
                <h1>Loading...</h1>
              </StdCompContainer>
              );      
        } else {
            return (
                <StdCompContainer breadcrumb={breadcrumb} isLoading={isLoading}>
                    <DocumentFormLoaded lang={lang} mode={mode} pkg={pkg} isSubmitting={isSubmitting} THIS={this} />
                </StdCompContainer>
            );
        }
    }

};

const DocumentFormLoaded = ({lang, mode, pkg, isSubmitting, THIS}) => 
    <Aux>
        <DocumentFormActions lang={lang} mode={mode} pkg={pkg} />
        <DocumentInfo lang={lang} mode={mode} pkg={pkg} />
        <Tabs>
            <TabList className={`document-form-tabs react-tabs__tab-list`}>
                <Tab>{T("Identity")}</Tab>
                <Tab>{T("Attachments")}</Tab>
            </TabList>
            <TabPanel>
                <IdentityMetadataForm 
                    lang={lang} 
                    mode={mode} 
                    pkg={pkg} 
                    isSubmitting={isSubmitting}
                    validationSchema={THIS.identityValidationSchema}
                    handleReset={THIS.handleIdentityReset} 
                    handleSubmit={THIS.handleIdentitySubmit} 
                    updateIriValue={THIS.updateIriValue}
                    validateFormField={THIS.validateFormField}
                    />
            </TabPanel>
            <TabPanel>
                <EmbeddedDocumentsForm
                    lang={lang}
                    mode={mode}
                    pkg={pkg}
                    isSubmitting={isSubmitting}
                    setSubmitting={THIS.setSubmitting}
                    reload={THIS.reloadAttachments}
                    handleRemove={THIS.handleRemoveAttachment}
                />
            </TabPanel>
        </Tabs>
    </Aux>;



export default DocumentForm ; 