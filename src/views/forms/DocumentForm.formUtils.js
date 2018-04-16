import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

import {T} from '../../utils/i18nHelper';
import { apiUrl } from '../../api';
import {handleApiException} from './DocumentForm.handlers';
import { getCrumbLinks } from '../../utils/RoutesHelper';
import { capitalizeFirst } from '../../utils/GeneralHelper';


/**
 * Loads a form context with  a document
 * @param {*} THIS the ``this`` of the calling Component.
 */
export const loadFormWithDocument = (THIS) => {
    let {iri} = THIS.props ; 
    THIS.setState({isSubmitting: true});
    iri = iri.startsWith("/") ? iri : `/${iri}` ;
    axios.post(
        apiUrl('document-open'), {
        data: {"iri": iri}
        }
    )
    .then(
        (response) => {
            const {error, akomaNtoso} = response.data;
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
                    form: aknDoc
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
    const {form} = THIS.state;

    let title = form.docTitle.value ;
    let type = form.docAknType.value;
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
    const {form} = THIS.state ; 
    for (let field in form) {
      // !+FUTURE_FIX(kohsah, 2018-01-16) aggregate state and set it in one shot
      validateFormField(THIS, field, form[field].value);
    }
};

/**
 * Validates the value of the passed in field name
 * using the Yup validator specified in the validationSchema
 */
export const validateFormField = (THIS, fieldName, fieldValue) => {
    THIS.validationSchema[fieldName].validate
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
export const formHasErrors = (THIS) => {
    const {form} = THIS.state;
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
        form: {
        ...THIS.state.form, 
        [fieldName]: {
            ...THIS.state.form[fieldName], 
            value: value,
            error: null
        }
        }
    });
};

export const setFieldError = (THIS, fieldName, err) => {
    THIS.setState({
        form: {
        ...THIS.state.form, 
        [fieldName]: {
            ...THIS.state.form[fieldName], 
            value: err.value === null ? '': err.value,
            error: err.message
        }
        }
    });
};
  
  
    