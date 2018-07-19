import React from 'react';
import {Card, CardBody, CardFooter, Row, Col, Button} from 'reactstrap';
import StatefulForm from './StatefulForm';
import FieldDate from './FieldDate';
import FieldText from './FieldText';
import {formHasErrors} from './DocumentForm.formUtils';
import {fixTime} from '../../utils/DateHelper';

class CustomMetadataForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit() {
    console.log("SUBMIT!");
  }

  /**
   * Wrapper on validateCustMetaField passed in as a prop
   */
  validateFormField = (field, value, type) => {
    return this.props.validateCustMetaField(field, value, type);
  }

  renderFields(form, errors) {
    const {mode} = this.props;
    let items = [];
    Object.keys(form).forEach(field => {
      if (form[field].type === 'date') {
        items.push(
          <FieldDate key={field} name={field} label={form[field].label} 
                     value={form[field].value} readOnly={mode === "view"}
                     error={errors[field]}
                     onChange={(field, value) => this.validateFormField(field, fixTime(value), form[field].type)}
          />
        );
      } else if (form[field].type === 'string') {
        items.push(
          <FieldText key={field} name={field} label={form[field].label} 
                     value={form[field].value} error={errors[field]}
                     readOnly={mode === "view"} 
                     onChange={(e) => this.validateFormField(field, e.target.value, form[field].type)}
          />
        )
      }
    });
    return items;
  }

  render() {
    const {customMeta: form} = this.props.pkg;
    if (form) {
      const errors = formHasErrors(form);
      return (
        <StatefulForm ref="customMetadataForm" onSubmit={this.handleSubmit.bind(this)} noValidate>
          {this.renderFields(form, errors)}
        </StatefulForm>
      );
    } else {
      return(<div>NO CUSTOM META!!!</div>)
    }
    
  }
}

export default CustomMetadataForm;