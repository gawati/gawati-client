import React from 'react';
import {Label, Input} from 'reactstrap';

import { isInvalidValue } from '../../utils/generalhelper';
import { aknIri, normalizeDocNumber } from '../../utils/urihelper';
import { iriDate, isValidDate } from '../../utils/datehelper';

import {FormControl, formControlErrorClass} from './FormControl';

/**
 *  `/akn/${docCountry}/${docType}/${docOfficialDate}/${docNumberNormalized}/${docLang}@/!${docPart}`
 */
const displayIri = ({docCountry, docType, docOfficialDate, docNumber, docLang, docPart }) => {
    const unknown = "[unknown]"; 
    var iriCountry, iriType, iriOfficialDate, iriNumber, iriLang, iriPart ; 
    iriType = isInvalidValue(docType.value) ? unknown : docType.value ;
    iriCountry = isInvalidValue(docCountry.value) ? unknown : docCountry.value ; 
    iriOfficialDate = isValidDate(docOfficialDate.value) ? iriDate(docOfficialDate.value) : unknown ;
    iriNumber = isInvalidValue(docNumber.value) ? unknown : normalizeDocNumber(docNumber.value); 
    iriLang = isInvalidValue(docLang.value.value) ? unknown : docLang.value.value ;
    iriPart = isInvalidValue(docPart.value) ? unknown : docPart.value ; 
  
    return aknIri(iriCountry, iriType, iriOfficialDate, iriNumber, iriLang, iriPart);
  }

  
const FieldIri = ({form, formValid}) => {
    let iri = displayIri(form);
    return (
      <FormControl className={ formControlErrorClass(!formValid) }>
        <div className="form-control-static"><b>Document IRI: {" "}</b> 
          <Label>{iri}</Label>
          <Input type="hidden" name="docIri" value={ iri } />
        </div>    
      </FormControl>
    );
  };

export default FieldIri;
