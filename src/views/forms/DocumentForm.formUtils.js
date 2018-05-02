import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

import {T} from '../../utils/i18nHelper';
import { apiUrl } from '../../api';
import {handleApiException} from './DocumentForm.handlers';
import {applyActionToState} from './DocumentForm.stateManager';
import { getCrumbLinks } from '../../utils/RoutesHelper';
import { capitalizeFirst, isInvalidValue } from '../../utils/GeneralHelper';
import { isValidDate, iriDate } from '../../utils/DateHelper';
import { aknExprIri, aknWorkIri, normalizeDocNumber, unknownIriComponent } from '../../utils/UriHelper';
import { STATE_ACTION_LOADED_DATA, STATE_ACTION_IS_NOT_SUBMITTING, STATE_ACTION_SET_FIELD_VALUE, STATE_ACTION_SET_FIELD_ERROR, STATE_ACTION_SET_DOCUMENT_LOAD_ERROR, STATE_ACTION_IS_LOADING } from './DocumentForm.constants';

/**
 * Loads a form context with  a document
 * @param {*} THIS the ``this`` of the calling Component.
 */
export const loadFormWithDocument = (THIS) => {
    let {params} = THIS.props.match ; 
    let {iri} = params;
    applyActionToState(THIS, {type: STATE_ACTION_IS_LOADING});
    iri = iri.startsWith("/") ? iri : `/${iri}` ;
    console.log("loadFormWithDocument: IRI FOUND = ", iri);
    axios.post(
        apiUrl('document-open'), {
        data: {"iri": iri}
        }
    )
    .then(
        (response) => {
            const {error, created, modified, akomaNtoso, workflow, permissions} = response.data;
            console.log("loadFormWithDocument: error, akomaNtoso ", error, response.data);
            if (error) {
                applyActionToState(THIS, {type: STATE_ACTION_SET_DOCUMENT_LOAD_ERROR});
            } else {
                let aknDoc = akomaNtoso; 
                aknDoc = convertDateData(
                    aknDoc,
                    ['docOfficialDate', 'docPublicationDate', 'docEntryIntoForceDate']
                );
                const createdDate = convertDateString(created);
                const modifiedDate = convertDateString(modified);

                applyActionToState(THIS, 
                    {
                        type: STATE_ACTION_LOADED_DATA, 
                        params: {
                            created: createdDate, 
                            modified: modifiedDate, 
                            akomaNtoso: aknDoc, 
                            workflow: workflow, 
                            permissions: permissions
                        }
                    }
                );
            } 
        }
    )
    .catch(
        (err) => {
            console.log(" ERROR ERROR ", err);
            applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
            handleApiException(err);
        }
    );
};

/**
 * Mutates the date strings in the Akoma Ntoso object into 
 * Javascript Date Objects
 * @param {*} aknDoc 
 */
const convertDateData = (aknDoc, dateFields) => {
    dateFields.forEach( (item) => {
        aknDoc[item].value = moment(
            aknDoc[item].value, 
            "YYYY-MM-DD", 
            true
        ).toDate();
    });
    return aknDoc;
};


/**
 * Converts a date string to a JS dateTime string
 * @param {string} dateString in iso8601 date format
 */
const convertDateString = (dateString) => {
    return moment(dateString).toDate();
}


export const loadViewWithDocument = (THIS, iri) => {
    return THIS;
};


/**
 * @memberof IdentityMetadata
 */
export const getBreadcrumb = (THIS, isLoading=false) => {
    
    const {mode} = THIS.props;
    const {params} = THIS.props.match;
    const {pkgIdentity} = THIS.state.pkg;
    let title = pkgIdentity.docTitle.value ;
    let type = pkgIdentity.docAknType.value;

    let crumbLinks = getCrumbLinks("document-ident-open", params);
    if (isLoading) {
        return (
        <Breadcrumb>
            <BreadcrumbItem>Loading...</BreadcrumbItem>
        </Breadcrumb>
        )   ;     
    } else
    if (mode === "edit") {
        return (
        <Breadcrumb>
            <BreadcrumbItem><a href={crumbLinks[0]}>{T("Home")}</a></BreadcrumbItem>
            <BreadcrumbItem><a href={crumbLinks[0]}>{capitalizeFirst(type)}</a></BreadcrumbItem>
            <BreadcrumbItem active>{title}</BreadcrumbItem>
        </Breadcrumb>
        );
    } else {
        return (
        <Breadcrumb>
            <BreadcrumbItem><a href={crumbLinks[0]}>{T("Home")}</a></BreadcrumbItem>
            <BreadcrumbItem><a href={crumbLinks[0]}>{T("New Document")}</a></BreadcrumbItem>
        </Breadcrumb>
        );
    }
};

export const validateFormFields = (THIS) => {
    const {pkgIdentity} = THIS.state.pkg ; 
    for (let field in pkgIdentity) {
      // !+FUTURE_FIX(kohsah, 2018-01-16) aggregate state and set it in one shot
      console.log(" PKG IDENTITY  = ", field);
      validateFormField(THIS, THIS.identityValidationSchema, field, pkgIdentity[field].value);
    }
};

/**
 * Validates the value of the passed in field name
 * using the Yup validator specified in the validationSchema
 */
export const validateFormField = (THIS, validationSchema, fieldName, fieldValue) => {
    validationSchema[fieldName].validate
        .validate(fieldValue)
        .then((value) => {
            setFieldValue(THIS, fieldName, value);
    })                                  
    .catch((err)=> {
        //console.log(" FIELD ERROR ", fieldName, err);
        setFieldError(THIS, fieldName, err);
    });  
};


/**
 * Checks if a form has errors
 * Returns an object with field names as keys which 
 * have errors.
 */
export const formHasErrors = (form) => {
    let errors = {};
    for (let field in form) {
        if ( form[field].error !== null ) {
            errors[field] = form[field];
        }
    }
    return errors;
};
  
export const setFieldValue = (THIS, fieldName, value) => {
    applyActionToState(
        THIS, 
        {
            type: STATE_ACTION_SET_FIELD_VALUE, 
            params: {fieldName: fieldName, fieldValue: value}
        }
    );
};

export const setFieldError = (THIS, fieldName, err) => {
    applyActionToState(
        THIS,
        {
            type: STATE_ACTION_SET_FIELD_ERROR,
            params: {fieldName: fieldName, err: err}
        }
    );
};
  

export const generateIRI = ({
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


    