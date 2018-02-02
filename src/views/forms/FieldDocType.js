import React from 'react';
import {Label, Input} from 'reactstrap'; 
import {FormControl, formControlErrorClass} from './FormControl';
import {FieldError} from './FieldError';
import {getDocTypes} from '../../utils/doctypeshelper';

class FieldDocType extends React.Component {

  state = {
    docTypes: []
  };

  componentDidMount() {
    this.setState({docTypes: getDocTypes()});
  }

/*
    {
        "aknDoctype": "act",
        "aknDocTag": "act",
        "localTypeName": "Act",
        "localTypeNameNormalized": "act",
        "category": "legislation"
    },
    */  

/**
 * 
 * 
 * @returns 
 * @memberof FieldDocType
 */
render() {
    const {onChange, readOnly, value, error} = this.props;
    return (
      <FormControl className={ formControlErrorClass(error) }>
        <Label htmlFor="docType">Document Type</Label>
        <Input type="select" value={value} disabled={ readOnly } onChange={onChange} name="docType" id="doctype" required>
        <option value="" key="blank">Select a Document Type</option> {
          this.state.docTypes.map( (docType) => 
            <option value={docType.localTypeNameNormalized} 
              data-akntype={docType.aknType} 
              key={docType.localTypeNameNormalized}>
              {docType.localTypeName}
            </option>
          )
        }
        </Input>
        <FieldError error={error} />
      </FormControl>
      );
  }

};

export default FieldDocType ;