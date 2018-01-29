import React from 'react';
import {Label} from 'reactstrap';
import InputDate from '../../components/InputDate';
import {FormControl, formControlErrorClass} from './FormControl';
import {FieldError} from './FieldError';

const FieldDocOfficialDate = ({onChange, onBlur, value, error}) => {

    return (
     <FormControl className={ formControlErrorClass(error) }>
      <Label htmlFor="docOfficialDate">Official Date</Label>
      <InputDate name="docOfficialDate" onChange={onChange}  onBlur={onBlur} value={ value } required />
      <FieldError error={error} />
    </FormControl>
    );
  }
  

export default FieldDocOfficialDate ; 