import React from 'react';
import { getLangs, coerceIntoArray } from '../../utils/generalhelper';
import { FormGroup, Label, Input } from 'reactstrap';
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
      console.log(" LANGS  ", this.langs);
    }

    handleChange = (value) => 
        this.props.onChange('docLang', value)
    ;
    
    handleBlur = () => 
        this.props.onBlur('docLang', true);
    ;
  
    render() {
    
      const {onChange, onBlur, value, error} = this.props ; 
      console.log(" FIELD DOC LANGUAGE  ", value, error);
      return (
        <FormControl className={ formControlErrorClass(error)}>
        <Label htmlFor="docLang">Language</Label>
        <Select
          id="docLang"
          name={this.props.name}
          options={this.langs}
          multi={false}
          onChange={this.handleChange}
          //onChange={this.handleChange}
          //onBlur={this.handleBlur}
          value={this.props.value}
          closeOnSelect={true}
        />
{/*         <Input type="select" name="docLang" onChange={onChange} defaultValue={value} id="doclang" required>
          <option value="" disabled >Select a Language</option>
          <option value="eng">English</option>
          <option value="fra">French</option>
          <option value="por">Portoguese</option>
          <option value="spa">Spanish</option>
          <option value="mul">Multilingual</option>
        </Input> */}
         {!!this.props.error &&  (
            <FieldError error={error} />
        )}
        </FormControl>
      ) ; 
    }
  }

  export default FieldDocLanguage; 