import React from 'react';
import {Label} from 'reactstrap';
import {FormControl} from './FormControl';
import { DatePicker } from 'react-widgets'

const fromDate = ({onChange,value}) => {

    return (
     <FormControl>
      <Label>From Date</Label>
      <DatePicker onChange={onChange} value={value} format="YYYY-MM-DD" placeholder = "Enter date in the format 'YYYY-MM-DD' " />
    </FormControl>
    );
};

export default fromDate ; 