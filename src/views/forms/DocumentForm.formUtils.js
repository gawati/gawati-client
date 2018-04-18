import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

import {T} from '../../utils/i18nHelper';
import { apiUrl } from '../../api';
import {handleApiException} from './DocumentForm.handlers';
import { getCrumbLinks } from '../../utils/RoutesHelper';
import { capitalizeFirst, isInvalidValue } from '../../utils/GeneralHelper';
import { isValidDate, iriDate } from '../../utils/DateHelper';
import { aknExprIri, aknWorkIri, normalizeDocNumber, unknownIriComponent } from '../../utils/UriHelper';

/**
 * Loads a form context with  a document
 * @param {*} THIS the ``this`` of the calling Component.
 */
export const loadFormWithDocument = (THIS) => {
    let {params} = THIS.props.match ; 
    let {iri} = params;
    THIS.setState({isSubmitting: true});
    iri = iri.startsWith("/") ? iri : `/${iri}` ;
    console.log("loadFormWithDocument: IRI FOUND = ", iri);
    axios.post(
        apiUrl('document-open'), {
        data: {"iri": iri}
        }
    )
    .then(
        (response) => {
            const {error, akomaNtoso} = response.data;
            console.log("loadFormWithDocument: error, akomaNtoso ", response.data);
            if (error) {
                THIS.setState({ documentLoadError: true });
            } else {
                let aknDoc = akomaNtoso; 
                aknDoc.docOfficialDate.value = moment(
                    aknDoc.docOfficialDate.value, 
                    "YYYY-MM-DD", 
                    true
                ).toDate();
                THIS.setState({
                    isSubmitting: false,
                    pkg: {pkgIdentity: aknDoc}
                });
            } 
        }
    )
    .catch(
        (err) => {
        THIS.setState({isSubmitting: false});
        handleApiException(err);
        }
    );
};

export const loadViewWithDocument = (THIS, iri) => {
    return THIS;
};


/**
 * @memberof IdentityMetadata
 */
export const getBreadcrumb = (THIS) => {
    const {mode} = THIS.props;
    const {params} = THIS.props.match;
    const {pkgIdentity} = THIS.state.pkg;
    console.log(" PAKG IDENTY ", pkgIdentity);
    let title = pkgIdentity.docTitle.value ;
    let type = pkgIdentity.docAknType.value;
    let crumbLinks = getCrumbLinks("document-ident-open", params);
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
      validateFormField(THIS, field, pkgIdentity[field].value);
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
    THIS.setState({
        pkg: {
            pkgIdentity: {
                ...THIS.state.pkgIdentity, 
                [fieldName]: {
                    ...THIS.state.pkgIdentity[fieldName], 
                    value: value,
                    error: null
                }
            }
        }
    });
};

export const setFieldError = (THIS, fieldName, err) => {
    THIS.setState({
        pkg:{
            pkgIdentity: {
                ...THIS.state.pkgIdentity, 
                [fieldName]: {
                    ...THIS.state.pkgIdentity[fieldName], 
                    value: err.value === null ? '': err.value,
                    error: err.message
                }
            }
        }
    });
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


    