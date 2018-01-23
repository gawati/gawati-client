import React from 'react';
import {Label, Input} from 'reactstrap'; 
import {FormControl, formControlErrorClass} from './FormControl';
import {FieldError} from './FieldError';

const FieldDocType = ({onChange, value, error}) => {
    return (
    <FormControl className={ formControlErrorClass(error) }>
      <Label htmlFor="docType">Document Type</Label>
      <Input type="select" defaultValue=""  onChange={onChange} name="docType" id="doctype" required>
      <option value="" key="blank">Select a Document Type</option>
        <option value="legislation" key="legisalation">Legislation</option>
        <option value="constitution" key="constitution" >Constitution</option>
        <option value="bill"  key="bill">Bill</option>
        <option value="judgement" key="judgement">Judgement</option>
      </Input>
      <FieldError error={error} />
    </FormControl>
    );
  };

export default FieldDocType ;