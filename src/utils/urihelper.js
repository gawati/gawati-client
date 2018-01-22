
export const aknIri = (docCountry, docType, docOfficialDate, docNumberNormalized, docLang, docPart) => {
    return `/akn/${docCountry}/${docType}/${docOfficialDate}/${docNumberNormalized}/${docLang}@/!${docPart}` ;
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

