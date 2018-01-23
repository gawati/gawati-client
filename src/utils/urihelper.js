

export const unknownIriComponent = () => {
    return "[unknown]";
};

export const iriNoSubType = (docCountry, docType, docOfficialDate, docNumberNormalized, docLang, docPart) => {
    return `/akn/${docCountry}/${docType}/${docOfficialDate}/${docNumberNormalized}/${docLang}@/!${docPart}` ;
};

export const iriWithSubType = (docCountry, docType, docSubType, docOfficialDate, docNumberNormalized, docLang, docPart) => {
    return  `/akn/${docCountry}/${docType}/${docSubType}/${docOfficialDate}/${docNumberNormalized}/${docLang}@/!${docPart}` ;
};

export const aknIri = (docCountry, docType, docSubType, docOfficialDate, docNumberNormalized, docLang, docPart) => {
    if (docType === docSubType) {
        return iriNoSubType(docCountry, docType, docOfficialDate, docNumberNormalized, docLang, docPart) ; 
    } else {
        return iriWithSubType(docCountry, docType, docSubType, docOfficialDate, docNumberNormalized, docLang, docPart);
    }
}
;

export const normalizeDocNumber = (docNumber) => {
    return docNumber
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[.;,?]/g, '')
        .replace(/[\\/]/g, '-')
        .replace(/[+!@#$%^&*()]/g, '') ;
};


