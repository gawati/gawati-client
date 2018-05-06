import {setInRoute} from '../../utils/RoutesHelper';


export const linkDocumentAdd = (uiLang) => {
    const lang = uiLang || "en" ;
    let navLinkTo = setInRoute(
      "document-add",
      {"lang": lang}
    );
    return navLinkTo;
};

export const linkDocumentEdit = (uiLang, linkIri) => {
    const lang = uiLang || "en" ;
    return setInRoute(
        "document-ident-edit", 
        {"lang": lang, "iri": linkIri }
    );    
};