import React from 'react';
import {Input, Label} from 'reactstrap';

import {FormControl, formControlErrorClass} from './FormControl';
import {FieldError} from './FieldError';
import { customFilterCountries } from '../../utils/ConfigHelper';

const FieldDocCountry = ({onChange, readOnly, value, error}) => {
    
    const countries = customFilterCountries();
    
    return (
      <FormControl className={ formControlErrorClass(error) }>
        <Label htmlFor="docCountry">Country</Label>
        <Input type="select" value={value} disabled={ readOnly } onChange={onChange} name="docCountry" id="country" required>
        <option value="">Select a Country</option>
          {countries.map( (country) => {
            return (
              <option value={ country.alpha2 } key={ `country-${country.alpha2}` } >{country.name}</option>  
            );
          })}
        </Input>
        <FieldError error={error} />
      </FormControl>
    );
  };

export default FieldDocCountry; 