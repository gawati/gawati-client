import React from 'react';
import {Input, Label} from 'reactstrap';
import {FormControl, formControlErrorClass} from './FormControl';
import {FieldError} from './FieldError';

const FieldDocTitle = ({onChange, value, error, readOnly}) => {
    return (
      <FormControl className={ formControlErrorClass(error) }>
        <Label htmlFor="docTitle">Title</Label>
        <Input type="text" name="docTitle" 
          value={value} onChange={onChange} 
          id="doctitle" readOnly={ readOnly } 
          placeholder="Enter the Title of the document" required/>
        <FieldError error={error} />
      </FormControl>
    )
  };

export default FieldDocTitle;