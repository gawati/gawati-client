
export const aknIri = (docCountry, docOfficialDate, docNumberNormalized, docLang, docPart) => 
    `/akn/${docCountry}/${docOfficialDate}/${docNumberNormalized}/${docLang}@/!${docPart}`
;

export const normalizeDocNumber = (docNumber) =>
    docNumber
        .trim()
        .replace(/\s\s+/g, '_')
        .replace(/\.;,/g, '')
        .replace(/\//g, '-')
    ;

