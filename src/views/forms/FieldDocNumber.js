import React from 'react';

import {Label, Input} from 'reactstrap';
import {FormControl, formControlErrorClass} from './FormControl';
import {FieldError} from './FieldError';

const FieldDocNumber = ({onChange, readOnly, value, error}) =>
<FormControl className={ formControlErrorClass(error) }>
  <Label htmlFor="docNumber">Document Number</Label>
  <Input type="text" id="docNumber" value={value} 
    onChange={onChange} 
    readOnly={ readOnly }
    placeholder="Enter the official document number" required/>
  <FieldError error={error} />
</FormControl> ;

export default FieldDocNumber;