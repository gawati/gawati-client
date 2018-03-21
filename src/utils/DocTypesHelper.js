import docTypes from '../configs/docTypes.json';

/**
 * {"docTypes": [
    {
        "aknType": "act",
        "aknDocTag": "act",
        "localTypeName": "Act",
        "localTypeNameNormalized": "act",
        "category": "legislation"
    },
 */
export const getDocTypes = () => {
    return docTypes.docTypes ;
};

/**
 * Returns the document Type object in the docTypes array
 * @param {string} findType name of akoma ntoso type name 
 */
export const getDocTypeFromAknType = (aknType) => {
    return getDocTypes().find(dType => dType['aknType'] === aknType) ;
};

/**
 * Returns the documentType object in the docTypes array matching the localTypeName (normalized)
 * @param {string} localTypeNameNormalized 
 */
export const getDocTypeFromLocalType = (localTypeNameNormalized) => {
    return getDocTypes().find(dType => dType['localTypeNameNormalized'] === localTypeNameNormalized)
};