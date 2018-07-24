import React from 'react';
import {Card, CardHeader, CardBody, CardFooter, Button} from 'reactstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
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

    const {customMeta: form, selectedCustomMeta: scm} = this.props.pkg;
    const options = form ? Object.keys(form).map(field => {
      return {value: field, label: form[field].label}
    }) : [];

    const selected = scm ? scm.map(field => {
      return {value: field, label: form[field].label}
    }) : [];

    this.state = {
      selectedOption: selected
    }
    this.selectOptions = options;
  }

  /**
   * Wrapper on validateCustMetaField passed in as a prop
   */
  validateFormField = (field, value, type) => {
    return this.props.validateCustMetaField(field, value, type);
  }

  handleSubmit(e) {
    const selected = this.state.selectedOption.map(op => op.value);
    this.props.handleSubmit(e, selected);
  }

  renderActions(formValid) {
    const {mode, isSubmitting} = this.props;
    if (mode === 'view') {
      return (<div></div>)
    } else {
      return (
        <div> 
        { " " }
          <Button type="submit" name="btnSubmit" size="sm" color="primary" disabled={isSubmitting || !formValid} onClick={this.handleSubmit.bind(this)}>
            <i className="fa fa-dot-circle-o"></i> Save
          </Button>
        </div>
      )
    }
  }

  renderFields(form, errors) {
    const {mode} = this.props;
    let items = [];
    this.state.selectedOption.forEach(f => {
      const field = f.value;
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

  handleSelection = (selectedOption) => {
    this.setState({ selectedOption });
  }

  renderSelector() {
    return (
      <Select name="cust-meta-options" value={this.state.selectedOption}
              placeholder="Select the custom metadata fields"
              multi={true} closeOnSelect={false}
              onChange={this.handleSelection} options={this.selectOptions}
      />
    );
  }

  render() {
    const {customMeta: form} = this.props.pkg;
    const {mode} = this.props;
    const errors = formHasErrors(form);
    const formValid = isEmpty(errors);
    return (
      <StatefulForm ref="customMetadataForm" noValidate>
        <Card className="doc-form-card">
          { mode === 'edit'
            ? <CardHeader>
                {this.renderSelector()}
              </CardHeader>
            : ''
          }
          <CardBody>
            {this.renderFields(form, errors)}
          </CardBody>
          <CardFooter>
            {this.renderActions(formValid)} 
          </CardFooter>
        </Card>
      </StatefulForm>
    );
  }
}

export default CustomMetadataForm;