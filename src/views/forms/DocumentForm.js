import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import IdentityMetadataForm from './IdentityMetadataForm';
import StdCompContainer from '../../components/general/StdCompContainer';

import {T} from '../../utils/i18nHelper';
import {DocumentFormActions} from './DocumentFormActions';

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
import { STATE_ACTION_RESET, STATE_ACTION_IS_SUBMITTING } from './DocumentForm.constants';
import { handleSubmitEdit, handleSubmitAdd } from './DocumentForm.handlers';

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
          isSubmitting: false,
          documentLoadError: false,
          mode: props.mode,
          /* 
          form has field names as state values 
          i.e. docTitle has to have a corresponding 
          <input name="docTitle" .... /> in the form
          */ 
          pkg: {
            pkgIdentity: identityInitialState(),
            pkgAttachments: []
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
        applyActionToState(this, {type: STATE_ACTION_RESET, params: {}});
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

    render() {
        const breadcrumb = getBreadcrumb(this);
        const {match, mode} = this.props;
        const {lang} = match.params;
        const {pkg, isSubmitting} = this.state ;
        return (
          <StdCompContainer breadcrumb={breadcrumb}>
            <DocumentFormActions lang={lang} />
            <Tabs>
            <TabList>
              <Tab>{T("Identity")}</Tab>
              <Tab>Attachments</Tab>
              <Tab>Signature</Tab>
              <Tab>Extended Metadata</Tab>
            </TabList>
            <TabPanel>
               <IdentityMetadataForm 
                    lang={lang} 
                    mode={mode} 
                    pkg={pkg} 
                    isSubmitting={isSubmitting}
                    validationSchema={this.identityValidationSchema}
                    handleReset={this.handleIdentityReset} 
                    handleSubmit={this.handleIdentitySubmit} 
                    updateIriValue={this.updateIriValue}
                    validateFormField={this.validateFormField}
                />
            </TabPanel>
            <TabPanel>
              <h2>Any content 2</h2>
            </TabPanel>
            <TabPanel>
              <h2>Any content 2</h2>
            </TabPanel>
            <TabPanel>
              <h2>Any content 2</h2>
            </TabPanel>

          </Tabs>
        </StdCompContainer>
        );
    }

};

export default DocumentForm ; 