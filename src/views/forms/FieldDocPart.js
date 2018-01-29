import React from 'react';
import {Label, Input} from 'reactstrap'; 
import {FormControl, formControlErrorClass} from './FormControl';
import {FieldError} from './FieldError';
import {getDocParts} from '../../utils/docpartshelper';

class FieldDocPart extends React.Component {

  state = {
    docParts: []
  };

  componentDidMount() {
    this.setState({docParts: getDocParts()});
  }

/**
 * 
 * 
 * @returns 
 * @memberof FieldDocType
 */
    render() {
        const {onChange, value, error, readOnly} = this.props;
        return (
        <FormControl className={ formControlErrorClass(error) }>
            <Label htmlFor="docPart">Document Part</Label>
            <Input type="select" value={value} readOnly={ readOnly }  onChange={onChange} name="docPart" id="docpart" required>
            <option value="" key="blank">Select a Document Part</option> {
            this.state.docParts.map( (docPart) => 
                <option value={docPart.partName} 
                key={docPart.partName}>
                {docPart.partLabel}
                </option>
            )
            }
            </Input>
            <FieldError error={error} />
        </FormControl>
        );
  }

};

export default FieldDocPart ;