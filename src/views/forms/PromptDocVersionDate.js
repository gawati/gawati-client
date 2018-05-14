import React from 'react';
import FieldDate from './FieldDate';
import {T} from '../../utils/i18nHelper';
import ConfirmModal from '../utils/ConfirmModal';

class PromptDocVersionDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isOpen: this.props.isOpen || false,
        docVersionDate: null,
        error: false
    }
    this.validationSchema = props.validationSchema;
    this.validateFormField = props.validateFormField;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isOpen: nextProps.isOpen });
  }

  onDocVersionDateChange(field, value) {
    const docVersionDate = value;
    //Hack: To update docVersionDate in pkgIdentity.
    this.validateFormField(field, value);
    
    this.validationSchema['docVersionDate'].validate.validate(docVersionDate)
    .then((docVersionDate) => {
      this.setState({docVersionDate, error:false});
    }).catch(err => {
      this.setState({error: true});
    })
  }

  closeModal = () => {
    const {error, docVersionDate} = this.state;
    if (!error && docVersionDate) {
      this.setState({isOpen: false});
      //Send back docVersionDate
      this.props.sendDocVersionDate(docVersionDate);
    }
    else {
      this.setState({error: true});
    }
  };

  render = () => {
    const error = this.state.error ? 'Choose a date' : '';
    return (
      <ConfirmModal show={this.state.isOpen}
                    title={T("Enter the Document Version Date")}
                    onOK={this.closeModal}
                    onOKLabel={T("Ok")}
                    onClose={() => this.setState({isOpen: false})}
                    onCloseLabel={T("Cancel")} >
        <FieldDate name="docVersionDate" value={this.state.docVersionDate} 
                   readOnly={false}
                   onChange={this.onDocVersionDateChange.bind(this)} />
        <div className="input-feedback">{error}</div>
      </ConfirmModal>
    );
  }
};

export default PromptDocVersionDate;