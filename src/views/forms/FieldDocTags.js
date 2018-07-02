import React from 'react';
import {Input, Label, InputGroup, InputGroupAddon, Button} from 'reactstrap';
import {FormControl} from './FormControl';

const FieldDocTags = ({onClick, value, disabled}) => {
    return (
      <FormControl >
        <Label htmlFor="docTags">Tags</Label>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <Button color="primary" onClick={onClick} disabled={disabled}><i className="fa fa-refresh" aria-hidden="true"></i></Button>
          </InputGroupAddon>
          <Input name="docTags" id="doctags" value={value} readOnly={true}/>
        </InputGroup>
      </FormControl>
    )
  };

export default FieldDocTags;