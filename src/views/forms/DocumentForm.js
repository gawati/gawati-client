import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import IdentityMetadataForm from './IdentityMetadataForm';
import EmbeddedDocumentsForm from './EmbeddedDocumentsForm';
import ClassificationMetadataForm from './ClassificationMetadataForm';
import StdCompContainer from '../../components/general/StdCompContainer';
import {Aux} from '../../utils/GeneralHelper';
import {T} from '../../utils/i18nHelper';
import { setInRoute } from '../../utils/RoutesHelper';
import DocumentFormActions from './DocumentFormActions';
import PromptDocType from './PromptDocType';
import ConfirmModal from '../utils/ConfirmModal';
import 'react-tabs/style/react-tabs.css';

/*
* Form Related configs and util functions
*/
import {
    identityInitialState,
    identityValidationSchema
} from './DocumentForm.formConfig';
import {
    workflowsInitialState,
    loadFormWithDocument,
    loadViewWithDocument,
    setFieldValue,
    validateFormFields,
    validateFormField,
    getBreadcrumb,
    generateIRI,
    getFreshPkg,
    getVersionPkg
} from './DocumentForm.formUtils' ;
import { applyActionToState } from './DocumentForm.stateManager';
import { STATE_ACTION_RESET_IDENTITY, STATE_ACTION_IS_SUBMITTING, STATE_ACTION_IS_NOT_SUBMITTING, STATE_ACTION_SWITCH_TAB, STATE_ACTION_CONFIRM_ADD_CLOSE, MSG_DOC_EXISTS_ON_PORTAL } from './DocumentForm.constants';
import { handleSubmitEdit, handleSubmitAdd, handleRemoveAttachment, handleExtractAttachment, handleRefreshTags } from './DocumentForm.handlers';
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
        console.log(" I18n_BLAH ", props.i18n);
        this.state = {
          isLoading: true,
          isSubmitting: false,
          documentLoadError: false,
          mode: props.mode,
          activeTab: 0,
          confirmAdd: false,
          /* 
          form has field names as state values 
          i.e. docTitle has to have a corresponding 
          <input name="docTitle" .... /> in the form
          */ 
          pkg: {
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
        this.refreshDocument = this.refreshDocument.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
        //this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        const {mode} = this.props;
        if (mode === "edit") {
            // load iri date
            loadFormWithDocument(this);
        } else if (mode === "view") {
            // mode === view 
            loadViewWithDocument(this);
        }
    }

    getWFInitialState = (docType, aknType) => {
        // add mode ... validate empty form
        validateFormFields(this);
        workflowsInitialState(this, docType, aknType);
    }

    updateIriValue = () => {
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
        const newPkg = getFreshPkg(this.state.pkg);
        applyActionToState(this, {type: STATE_ACTION_IS_SUBMITTING});
        if (mode === "edit") {
            handleSubmitEdit(this, newPkg)
            return;
        }
        if (mode === "add") {
          handleSubmitAdd(this, newPkg);
          return;
        }
    }

    updateVersion = (docVersionDate) => {
        getVersionPkg(this.state.pkg, docVersionDate)
        .then((versionPkg) => {
            applyActionToState(this, {type: STATE_ACTION_IS_SUBMITTING});
            handleSubmitAdd(this, versionPkg);
        })
        .catch((err) => {
            console.log(" Error in getVersionPkg ", err);
            throw err;
        });
    }

    refreshTags = () => { 
        applyActionToState(this, {type: STATE_ACTION_IS_SUBMITTING});
        handleRefreshTags(this, this.refreshDocument);
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

    refreshDocument = () => {
        this.reloadForm(this.state.activeTab);
    }

    reloadAttachments = () => {
        this.reloadForm(1);
    }

    reloadForm = (activeTab) => {
        loadFormWithDocument(this);
        applyActionToState(this, {
            type: STATE_ACTION_SWITCH_TAB, 
            params: {activeTab: activeTab}
        });
    }

    //Reload newly added doc in `edit` mode
    reloadAddedDoc = (iri) => {
        const linkIri = iri.startsWith("/") ? iri.slice(1): iri;
        let pushLink = setInRoute(
            `document-ident-edit`,
            {"lang": "en", "iri": linkIri }
        );
        this.props.history.push(pushLink);
        this.refreshDocument();
    }

    handleRemoveAttachment = (data) => {
        applyActionToState(this, {type: STATE_ACTION_IS_SUBMITTING});
        handleRemoveAttachment(this, data, this.reloadAttachments);
        return;
    }

    handleExtractAttachment = (data) => {
        applyActionToState(this, {type: STATE_ACTION_IS_SUBMITTING});
        handleExtractAttachment(this, data);
        return;
    }

    handleConfirmAdd = (confirmed) => {
        if (confirmed) {
            const newPkg = getFreshPkg(this.state.pkg);
            applyActionToState(this, {type: STATE_ACTION_IS_SUBMITTING});
            handleSubmitAdd(this, newPkg, true); //last param skipCheck=true
        }
        applyActionToState(this, {type: STATE_ACTION_CONFIRM_ADD_CLOSE});
    }

    /**
     * Confirm if the new doc should be added even though
     * it already exists on the portal data server.
     */
    renderConfirmAdd() {
        return (
            <ConfirmModal show={this.state.confirmAdd}
                    title={T(MSG_DOC_EXISTS_ON_PORTAL)}
                    onOK={() => this.handleConfirmAdd(true)}
                    onOKLabel={T("Yes")}
                    onClose={() => this.handleConfirmAdd(false)}
                    onCloseLabel={T("No")} >
            </ConfirmModal>
        );
    }

    renderPrompt() {
        const {mode} = this.props;
        return (
            <PromptDocType isOpen={mode === "add"} validationSchema={this.identityValidationSchema} sendDocTypes={this.getWFInitialState.bind(this)}/>
        );
    }

    render() {
        const {match, mode} = this.props;
        const {lang} = match.params;
        const {pkg, isSubmitting, isLoading} = this.state ;

        const breadcrumb = getBreadcrumb(this, isLoading);

        if (isLoading) {
            return (
              <StdCompContainer breadcrumb={breadcrumb} isLoading={isLoading}>
                <h1>Loading...</h1>
                {this.renderPrompt()}
              </StdCompContainer>
              );      
        } else {
            return (
                <StdCompContainer breadcrumb={breadcrumb} isLoading={isLoading}>
                    <DocumentFormLoaded lang={lang} mode={mode} pkg={pkg} isSubmitting={isSubmitting} THIS={this} />
                    {this.renderConfirmAdd()}
                </StdCompContainer>
            );
        }
    }

};

const DocumentFormLoaded = ({lang, mode, pkg, isSubmitting, THIS}) => 
    <Aux>
        <DocumentFormActions lang={lang} mode={mode} pkg={pkg} refreshDocument={ THIS.refreshDocument} />
        <DocumentInfo lang={lang} mode={mode} pkg={pkg} />
        <Tabs defaultIndex={THIS.state.activeTab}>
            <TabList className={`document-form-tabs react-tabs__tab-list`}>
                <Tab>{T("Identity")}</Tab>
                <Tab>{T("Attachments")}</Tab>
                <Tab>{T("Metadata")}</Tab>
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
                    generateIRI={generateIRI}
                    updateIriValue={THIS.updateIriValue}
                    validateFormField={THIS.validateFormField}
                    updateVersion={THIS.updateVersion}
                    refreshTags={THIS.refreshTags}
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
                    handleExtract={THIS.handleExtractAttachment}
                />
            </TabPanel>
            <TabPanel>
                <ClassificationMetadataForm
                    lang={lang}
                    mode={mode}
                    pkg={pkg}
                />
            </TabPanel>
        </Tabs>
    </Aux>;



export default DocumentForm ; 