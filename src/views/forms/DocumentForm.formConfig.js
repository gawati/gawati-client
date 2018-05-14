import Yup from 'yup';

/**
 * 2018-05-09 Set all date fields to have a null error / default value
 */
export const identityInitialState = () => (
    {
        docCreatedDate: {value: undefined, error: null},
        docModifiedDate: {value: undefined, error: null},
        docLang: {value: {} , error: null },
        docType: {value: '', error: null },
        docAknType: {value: '', error: null },
        docCountry: {value: '', error: null },
        docTitle: {value: '', error: null},
        docOfficialDate: {value: null, error: null },
        docPublicationDate: {value:  null, error:null},
        docEntryIntoForceDate: {value:  null, error:null},
        docNumber: {value: '', error: null },
        docPart: {value: '', error: null },
        docIri : {value: '', error: null }
    }
);

export const identityValidationSchema = () => (
    {
        docLang: {
          validate:  Yup.object()
                        .shape({
                            label: Yup.string().required(), 
                            value: Yup.string().required("You must select a language")
                        })
                        .required(" Enter a language") 
        }, 
        docType: {
          validate:  Yup.string().required(" You must select a document type")
        },
        docAknType: {
          validate: Yup.string().required("You must select a akn doc Type")
        },
        docCountry: {
          validate:  Yup.string().required(" You must select a country")
        },
        docTitle: {
          validate:  Yup.string().required(" Title is required ")
        },
        docOfficialDate: {
          validate: Yup.date(" Official date is required").typeError(" You need to enter a date")
        },
        docPublicationDate: {
          validate: Yup.date(" Publication date is required").typeError(" You need to enter a date")
        },
        docEntryIntoForceDate: {
          validate: Yup.date(" Entry into Force date is required").typeError(" You need to enter a date")
        },
        docNumber: {
          validate: Yup.string().required(" Document number is required ")
        }, 
        docPart: {
          validate: Yup.string().required("Document part is required")
        },
        docIri: {
          validate: Yup.string()
        }
    }
);
