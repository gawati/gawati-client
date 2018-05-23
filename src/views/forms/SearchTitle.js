import React from 'react';
import {Input, Label} from 'reactstrap';
import {FormControl} from './FormControl';

const searchTitle = ({onChange, onKeyPress, value}) => {
    return (
      <FormControl>
        <Label htmlFor="searchTitle"> Search Title</Label>
        <Input type="search" name="searchTitle" 
          value={value} onChange={onChange}
          onKeyPress= {onKeyPress}
          id="searchtitle" 
          placeholder="Enter the Title of the document"/>
      </FormControl>
    )
  };

export default searchTitle;