import React from 'react';
import {Input, Label} from 'reactstrap';
import {FormControl, formControlErrorClass} from './FormControl';
import {FieldError} from './FieldError';

const FieldText = ({onChange, readOnly, name, label, value, error}) => {
  return (
    <FormControl className={ formControlErrorClass(error) }>
    <Label htmlFor={name}>{label}</Label>
    <Input type="text" name={name} id={name} value={value}  
           readOnly={readOnly} onChange={onChange}
           placeholder={label} required/>
    <FieldError error={error} />
  </FormControl>
  );
};

export default FieldText ; 