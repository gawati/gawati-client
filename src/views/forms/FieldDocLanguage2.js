import React from 'react';
import { getLangs, coerceIntoArray } from '../../utils/generalhelper';
import { FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

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
    
      const {onChange, value} = this.props ; 
      //console.log(" LANGS  ", this.langs);
      return (
        <FormGroup>
        <Label htmlFor="docLang">Language</Label>
        <Select
          id="doclang"
          name={this.props.name}
          options={this.langs}
          multi={false}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
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
        </FormGroup>
      ) ; 
    }
  }

  export default FieldDocLanguage; 