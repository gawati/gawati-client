/**
 * Has sanity checks and consistency checks to be done to verify 
 * consistency of application
 */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { getDocTypes } from './DocTypesHelper';
import { getAknDocTypes } from './AknDocTypesHelper';
import { T } from './i18nHelper';
import { apiUrl } from '../api';
import { StartupError } from '../views/pages/error/Error';


/**
 * Checks if docTypes are valid
 */
export const validDocTypesCheck = () => {
    // check if docTypes are valid AknDocTypes 
    // .aknType has the akn Doc type
    const docTypes = getDocTypes();
    // this is an array of strings
    const aknDocTypes = getAknDocTypes();
    const validDocType = docTypes.every( 
        docType => aknDocTypes.indexOf(docType.aknType) >= 0
    );
    if (!validDocType) {
        const wrongDocTypes = docTypes
                                .filter( (docType) => aknDocTypes.indexOf(docType.aknType) === -1 )
                                .map( (t) => t.aknType).join(",") ;
        return {
            status: false, 
            message: T(`The following document types are not supported by the editor - ${wrongDocTypes}, aborting launch`)
        };
    }
    // check if workflows exist for available document types + sub Type combos. 
    return {status:true};
};

/*
Every docType has to have a corresponding workflow configuration
workflows array object:

{
    "aknType": "judgment",
    "aknDocTag": "judgment",
    "localTypeName": "Judgement",
    "localTypeNameNormalized": "courtjudgment",
    "category": "case law"
}
 */
export const validWorkflowsCheck = () => {
    const docTypes = getDocTypes();
    console.log(" validWorkflowsCheck ", docTypes, apiUrl('workflows-meta'));
    const ret = axios.get(apiUrl('workflows-meta'))
        .then((response) => {
            console.log(" validWorkflowsCheck response = ", response);
            const workflows = response.data; 
            const invalidWorkflows = [];
            const valid = docTypes.every( 
                (docType) => {
                    // {doctype: ... , subtype: .. }
                    const dType = docType.aknType;
                    const dSubType = docType.localTypeNameNormalized;
                    // check if the doctype subtype combination has a workflow
                    // if it does not then the find returns null
                    const wfMatch = workflows.find( (item) => item.doctype === dType && item.subtype === dSubType );
                    if (wfMatch == null ) {
                        invalidWorkflows.push({doctype: dType, subtype: dSubType });
                    }
                    return wfMatch == null ? false: true;
                });
            return {status: valid, data: valid ? response.data: invalidWorkflows};
        })
        .catch((err) => {
            console.log(" Error in validWorkflowsCheck ", err);
            throw err;
        });
    return ret;
};

/**
 * Called from index.js, validates if document types are configured correctly, 
 * and if workflows are present for loaded document types. 
 * @param {function} appLoader function that launches the application if the sanity checks pass. 
 */
export const sanityChecker = (appLoader) => {
    const docTypesCheck = validDocTypesCheck();
    if (docTypesCheck.status === true) {
        validWorkflowsCheck()
            .then( (statusObj) => {
                if (statusObj.status === true) {
                    // workflows are valid
                    appLoader();
                } else {
                    const dTypes = statusObj.data.map( (dType) => `${dType.doctype} / ${dType.subtype}` ).join(", ");
                    const errMsg1 = T("There is no workflow specified for these document-Type / sub-Types - ");
                    const errMsg2 = T("Please check if docTypes.json and the workflow configuration on the server are in sync ! Every document-type / sub-type combination needs to have a corresponding workflow")
                    ReactDOM.render(
                        <StartupError message={ `${errMsg1} ${dTypes} ${errMsg2}` } />,
                        document.getElementById('root')
                    );
                }
                })
            .catch((err) => {
                ReactDOM.render(
                    <StartupError message={ T(`There was an exception during application startup ${err}`) } />,
                    document.getElementById('root')
                );
            });
    } else {
        ReactDOM.render(
            <StartupError message={ docTypesCheck.message } />,
            document.getElementById('root')
        );
    }
};


