import React from 'react';
import { getLangs, coerceIntoArray } from '../../utils/GeneralHelper';
import { Label } from 'reactstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { FieldError } from './FieldError';
import {FormControl, formControlErrorClass} from './FormControl';
import '../../css/IdentityMetadata.css';

class FieldDocLanguage extends React.Component {
    constructor(props) {
      super(props);
      this.langs =
        getLangs().lang.map( 
            (value) => {
                value.desc = coerceIntoArray(value.desc)
                return value;
            }
        ).map(
            (value) => {
                return {
                    value: value.alpha3b, 
                    label: value.desc.find( item => item.lang === 'eng' ).content 
                };
            }
        ); 

    }

    handleChange = (value) => {
        const {name} = this.props;
        this.props.onChange(name, value);
    }
    ;
    
    handleBlur = () => {
        const {name} = this.props;
        this.props.onBlur(name, true);
    }
    ;
  
    render() {
    
      const {name, readOnly, label, value, error} = this.props ; 
     
      return (
        <FormControl className={ formControlErrorClass(error)}>
        <Label htmlFor={name}>{ label }</Label>
        <Select
          id={name}
          name={name}
          options={this.langs}
          multi={false}
          disabled={readOnly}
          onChange={this.handleChange}
          //onChange={this.handleChange}
          //onBlur={this.handleBlur}
          value={value}
          closeOnSelect={true}
        />
         {!!this.props.error &&  (
            <FieldError error={error} />
        )}
        </FormControl>
      ) ; 
    }
  }

  export default FieldDocLanguage; 