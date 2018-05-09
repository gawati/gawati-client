import React from 'react';
import PropTypes from 'prop-types';

import {Label} from 'reactstrap';
import InputDate from '../../components/widgets/InputDate';
import {FormControl, formControlErrorClass} from './FormControl';
import {FieldError} from './FieldError';

const FieldDate = ({onChange, onBlur, readOnly, name, label, value, error}) => {

    return (
     <FormControl className={ formControlErrorClass(error) }>
      <Label htmlFor={name}>{label}</Label>
      <InputDate name={name} 
        onChange={onChange}  
        onBlur={onBlur} 
        readOnly={readOnly} 
        value={ value }  />
      <FieldError error={error} />
    </FormControl>
    );
};
FieldDate.propTypes =  {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  readOnly: PropTypes.bool,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.instanceOf(Date)
};

  

export default FieldDate ; 