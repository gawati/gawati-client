import React from 'react';
import {Card, CardBody, CardFooter, Button} from 'reactstrap';
import StatefulForm from './StatefulForm';
import FieldDate from './FieldDate';
import FieldText from './FieldText';
import {isEmpty} from '../../utils/GeneralHelper';
import {formHasErrors} from './DocumentForm.formUtils';
import {fixTime} from '../../utils/DateHelper';
import {DynamicGrid} from '../../components/utils/DynamicGrid';

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

  renderActions(formValid) {
    const {mode, isSubmitting} = this.props;
    if (mode === 'view') {
      return (<div></div>)
    } else {
      return (
        <div> 
        { " " }
          <Button type="submit"  name="btnSubmit" size="sm" color="primary" disabled={isSubmitting || !formValid}><i className="fa fa-dot-circle-o"></i> Save</Button>
        </div>
      )
    }
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
    return DynamicGrid(items, 3);
  }

  render() {
    const {customMeta: form} = this.props.pkg;
    if (form) {
      const errors = formHasErrors(form);
      const formValid = isEmpty(errors);
      return (
        <StatefulForm ref="customMetadataForm" onSubmit={this.handleSubmit.bind(this)} noValidate>
          <Card className="doc-form-card">
            <CardBody>
              {this.renderFields(form, errors)}
              {this.renderActions(formValid)}
            </CardBody>
          </Card>
        </StatefulForm>
      );
    } else {
      return(<div>NO CUSTOM META!!!</div>)
    }
    
  }
}

export default CustomMetadataForm;