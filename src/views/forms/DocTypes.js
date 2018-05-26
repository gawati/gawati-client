import React from 'react';
import {Input,Label} from 'reactstrap'; 
import {getDocTypes} from '../../utils/DocTypesHelper';
import {FormControl} from './FormControl';

class DocTypes extends React.Component {

state = {
    docTypes: []
  };

  componentDidMount() {
    this.setState({docTypes: getDocTypes()});
  }
  render() {
    const {onChange,value} = this.props;
    return (
      <FormControl>
        <Label htmlFor="docTypes">Document Type</Label>
        <Input type="select" value={value} onChange={onChange} name="docTypes" id="doctypes" >
        <option value="" key="blank">Select a Document Type</option> {
          this.state.docTypes.map( (docType) => 
            <option value={docType.localTypeName} 
              data-akntype={docType.aknType} 
              key={docType.localTypeNameNormalized}>
              {docType.localTypeName}
            </option>
          )
        }
        </Input>
      </FormControl>
      );
  } 
}

export default DocTypes ;