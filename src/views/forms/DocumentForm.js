import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { isInvalidValue} from '../../utils/GeneralHelper';
import { aknExprIri, aknWorkIri, normalizeDocNumber, unknownIriComponent } from '../../utils/UriHelper';
import { iriDate, isValidDate } from '../../utils/DateHelper';


/*
* Form Related configs and util functions
*/
import {
    formInitialState, 
    validationSchema
} from './DocumentForm.formConfig';
import {
    loadFormWithDocument,
    loadViewWithDocument,
    setFieldValue,
    validateFormFields,
} from './DocumentForm.formUtils' ;

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
          form: formInitialState()
        };
        /** 
         * This provides validation of each field value using Yup
         * The validator function is declared in Yup syntax here, and
         * applied in the onChange of the field. 
         */
        this.validationSchema = validationSchema();
        // bindings
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
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

    generateIRI = ({
        docCountry, 
        docType, 
        docAknType, 
        docOfficialDate, 
        docNumber, 
        docLang, 
        docPart 
    }) => {
        const unknown = unknownIriComponent(); 
        var iriCountry, iriType, iriOfficialDate, iriNumber, iriLang, iriPart , iriSubType; 
        iriType = isInvalidValue(docAknType.value) ? unknown : docAknType.value ;
        iriSubType = isInvalidValue(docType.value) ? unknown: docType.value ;
        iriCountry = isInvalidValue(docCountry.value) ? unknown : docCountry.value ; 
        iriOfficialDate = isValidDate(docOfficialDate.value) ? iriDate(docOfficialDate.value) : unknown ;
        iriNumber = isInvalidValue(docNumber.value) ? unknown : normalizeDocNumber(docNumber.value); 
        iriLang = isInvalidValue(docLang.value.value) ? unknown : docLang.value.value ;
        iriPart = isInvalidValue(docPart.value) ? unknown : docPart.value ; 
        return aknExprIri(
          aknWorkIri(
            iriCountry, 
            iriType, 
            iriSubType, 
            iriOfficialDate, 
            iriNumber
          ),
          iriLang, 
          iriPart
        );
    };
  
    updateIriValue = () => {
        setFieldValue(this, "docIri", this.generateIRI(this.state.form));
    };

    render() {
        return (
            <Tabs>
            <TabList>
              <Tab>Identity</Tab>
              <Tab>Attachments</Tab>
              <Tab>Signature</Tab>
              <Tab>Extended Metadata</Tab>
            </TabList>
            <TabPanel>
              <h2>Any content 1</h2>
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
        );
    }

};

export default DocumentForm ; 