/**
 * Helper functions to make it easy to work with data
 */

export const iriFromPackage = (docPkg) => {
    const doc = docPkg.akomaNtoso;
    let linkIri = doc.docIri.value.startsWith("/") ? doc.docIri.value.slice(1): doc.docIri.value ; 
    return linkIri;
};



