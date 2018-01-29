import React from 'react';
import {Input, Label} from 'reactstrap';

import {FormControl, formControlErrorClass} from './FormControl';
import {FieldError} from './FieldError';

const FieldDocCountry = ({onChange, value, error}) => {
    return (
      <FormControl className={ formControlErrorClass(error) }>
        <Label htmlFor="docCountry">Country</Label>
        <Input type="select" value={value}  onChange={onChange} name="docCountry" id="country" required>
        <option value="">Select a Country</option>
          <option value="ke" key="country-ke">Kenya</option>
          <option value="tz" key="country-tz">Tanzania</option>
          <option value="ng" key="country-ng">Nigeria</option>
          <option value="ao" key="country-ao">Angola</option>
        </Input>
        <FieldError error={error} />
      </FormControl>
    );
  };

export default FieldDocCountry; 