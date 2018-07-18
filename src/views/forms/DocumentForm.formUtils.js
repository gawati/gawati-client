import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

import {T} from '../../utils/i18nHelper';
import { apiUrl } from '../../api';
import {handleApiException} from './DocumentForm.handlers';
import {applyActionToState} from './DocumentForm.stateManager';
import { getCrumbLinks } from '../../utils/RoutesHelper';
import { capitalizeFirst, isInvalidValue, isEmpty } from '../../utils/GeneralHelper';
import { isValidDate, iriDate } from '../../utils/DateHelper';
import { aknExprIriThis, aknExprIri, aknWorkIri, normalizeDocNumber, unknownIriComponent } from '../../utils/UriHelper';
import { STATE_ACTION_LOADED_DATA, STATE_ACTION_IS_NOT_SUBMITTING, STATE_ACTION_SET_FIELD_VALUE, STATE_ACTION_SET_FIELD_ERROR, STATE_ACTION_SET_DOCUMENT_LOAD_ERROR, STATE_ACTION_IS_LOADING, STATE_ACTION_LOADED_DEFAULTS } from './DocumentForm.constants';

/**
 * Loads 
 * - a default Workflow object (along with a set of Permissions)
 * - custom default meta data for the akn type
 * @param {*} THIS the ``this`` of the calling Component.
 */
export const docOtherInit = (THIS, docType, aknType) => {
    axios.all([
        axios.post(apiUrl('workflows-defaults'), {
            data: {"aknType": aknType, "aknSubType": docType}
        }),
        axios.post(apiUrl('documents-custom-meta'), {
            data: {"aknType": aknType}
        })
    ])
    .then(axios.spread(function (wfPer, custMeta) {
        setFieldValue(THIS, 'docType', docType);
        setFieldValue(THIS, 'docAknType', aknType);
        applyActionToState(THIS, {
            type: STATE_ACTION_LOADED_DEFAULTS,
            params: {
                workflow: wfPer.data.workflow,
                permissions: wfPer.data.permissions,
                customMeta: custMeta.data
            }
        });
    }))
    .catch((err) => {
        console.log(" Error in setting initial (workflow, custom metadata) state ", err);
        throw err;
    });
}

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
            const {error, akomaNtoso, workflow, permissions} = response.data;
            console.log("loadFormWithDocument: error, akomaNtoso ", error, response.data);
            if (error) {
                applyActionToState(THIS, {type: STATE_ACTION_SET_DOCUMENT_LOAD_ERROR});
            } else {
                let aknDoc = akomaNtoso; 
                aknDoc = convertDateData(
                    aknDoc,
                    ['docOfficialDate', 'docPublicationDate', 'docEntryIntoForceDate', 'docVersionDate']
                );

                aknDoc = convertDateTime(aknDoc, ['docCreatedDate', 'docModifiedDate']);

                applyActionToState(THIS, 
                    {
                        type: STATE_ACTION_LOADED_DATA, 
                        params: {
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

export const loadViewWithDocument = (THIS) => {
    let {params} = THIS.props.match ; 
    let {iri} = params;
    applyActionToState(THIS, {type: STATE_ACTION_IS_LOADING});
    iri = iri.startsWith("/") ? iri : `/${iri}` ;
    console.log("loadViewWithDocument: IRI FOUND = ", iri);
    axios.post(
        apiUrl('document-open'), {
        data: {"iri": iri}
        }
    )
    .then(
        (response) => {
            const {error, akomaNtoso, workflow, permissions} = response.data;
            console.log("loadViewWithDocument: error, akomaNtoso ", error, response.data);
            if (error) {
                applyActionToState(THIS, {type: STATE_ACTION_SET_DOCUMENT_LOAD_ERROR});
            } else {
                let aknDoc = akomaNtoso; 
                aknDoc = convertDateData(
                    aknDoc,
                    ['docOfficialDate', 'docPublicationDate', 'docEntryIntoForceDate', 'docVersionDate']
                );

                aknDoc = convertDateTime(aknDoc, ['docCreatedDate', 'docModifiedDate']);

                applyActionToState(THIS, 
                    {
                        type: STATE_ACTION_LOADED_DATA, 
                        params: {
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
 * Set a time of 12:00:00 to avoid timezone related errors
 * @param {*} aknDoc 
 */
const convertDateData = (aknDoc, dateFields) => {
    dateFields.forEach( (item) => {
        let dateTime = aknDoc[item].value + ' 12:00:00 Z';
        aknDoc[item].value = moment(
            dateTime,
            "YYYY-MM-DD HH:mm:ss Z",
            true
        ).toDate();
    });
    return aknDoc;
};

/**
 * Mutates the dateTime strings (iso8601 format) in the
 * Akoma Ntoso object into a JS dateTime string
 * @param {*} aknDoc
 */
const convertDateTime = (aknDoc, dateTimeFields) => {
    dateTimeFields.forEach( (item) => {
        aknDoc[item].value = moment(aknDoc[item].value).toDate();
    });
    return aknDoc;
}

/**
 * @memberof IdentityMetadata
 */
export const getBreadcrumb = (THIS, isLoading=false) => {
    
    const {mode} = THIS.props;
    const {params} = THIS.props.match;
    const {pkgIdentity} = THIS.state.pkg;
    let title = pkgIdentity.docTitle.value ;
    let type = pkgIdentity.docAknType.value;

    let crumbLinks = getCrumbLinks("document-ident-edit", params);
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
    docVersionDate, 
    docPart 
}) => {
    const unknown = unknownIriComponent(); 
    var iriCountry, iriType, iriOfficialDate, iriNumber, iriLang, iriVersionDate, iriPart , iriSubType; 
    iriType = isInvalidValue(docAknType.value) ? unknown : docAknType.value ;
    iriSubType = isInvalidValue(docType.value) ? unknown: docType.value ;
    iriCountry = isInvalidValue(docCountry.value) ? unknown : docCountry.value ; 
    iriOfficialDate = isValidDate(docOfficialDate.value) ? iriDate(docOfficialDate.value) : unknown ;
    iriNumber = isInvalidValue(docNumber.value) ? unknown : normalizeDocNumber(docNumber.value); 
    iriLang = isInvalidValue(docLang.value.value) ? unknown : docLang.value.value ;
    iriVersionDate = isValidDate(docVersionDate.value) ? iriDate(docVersionDate.value) : unknown ;
    iriPart = isInvalidValue(docPart.value) ? unknown : docPart.value ; 
    return aknExprIriThis(
            aknExprIri(
                aknWorkIri(
                    iriCountry,
                    iriType,
                    iriSubType,
                    iriOfficialDate,
                    iriNumber
                ),
                iriLang,
                iriVersionDate,
                iriOfficialDate
            ),
            iriPart
    );
};

/**
 * State might not be udpated with new fields if in the midst of a state update
 * cycle. This returns the package with the latest values.
 * i.e what the state pkg will be when the update cycle completes.
 * @param {pkg} current state pkg
 * @params {newFields} latest pkgIdentity fields (Optional)
 */
export const getFreshPkg = (pkg, newFields={}) => {
    const {pkgIdentity: form} = pkg;
    let pkgIdentity = Object.assign({}, form);
    if (!isEmpty(newFields)) {
        for (let field in newFields) {
            if (newFields.hasOwnProperty(field)) {
                let value = newFields[field];
                pkgIdentity[field] = value;
            }
        }
    }
    //Generate docIri with fresh values
    pkgIdentity['docIri'] = {value: generateIRI(pkgIdentity), error: null }
    const newPkg = Object.assign({}, pkg, {pkgIdentity});
    return newPkg;
}

/**
 * Create the new version package
 */
export const getVersionPkg = (pkg, docVersionDate) => {
    return new Promise(function(resolve, reject){
        //Update the Version date
        const newFields = {
            "docVersionDate": {value: docVersionDate, error: null}
        }
        let newPkg = getFreshPkg(pkg, newFields);

        //Init attachments
        newPkg.pkgAttachments = [];

        //Replace workflow and permissions with defaults.
        const {docType, docAknType} = pkg.pkgIdentity;
        axios.post(
            apiUrl('workflows-defaults'), {
            data: {"aknType": docAknType.value, "aknSubType": docType.value}
            }
        )
        .then((res) => {
            newPkg.workflow = res.data.workflow; 
            newPkg.permissions = res.data.permissions;
            resolve(newPkg);
        })
        .catch((err) => {
            reject(err);
        });
    });
}