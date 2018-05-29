import React from 'react';
import FieldDate from './FieldDate';
import {T} from '../../utils/i18nHelper';
import {fixTime} from '../../utils/DateHelper';
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
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isOpen: nextProps.isOpen });
  }

  isVersionLater(docVersionDate) {
    const {curDates} = this.props;
    if (new Date(docVersionDate) <= new Date(curDates.versionDate)) {
      this.setState({
        docVersionDate: docVersionDate,
        error: true,
        errorMsg: `Version date must be later than the current version date (${curDates.versionDate})`
      });
      return false;
    }
    return true;
  }

  onDocVersionDateChange(field, value) {
    //we fix the time to avoid timezone issues
    const docVersionDate = fixTime(value);
    if (this.isVersionLater(docVersionDate)) {
      this.validationSchema['docVersionDate'].validate.validate(docVersionDate)
      .then((docVersionDate) => {
        this.setState({docVersionDate, error:false, errorMsg: ""});
      }).catch(err => {
        this.setState({error: true, errorMsg: "Choose a valid date"});
      })
    }
  }

  closeModal() {
    const {error, docVersionDate} = this.state;
    if (!docVersionDate) {
      this.setState({
        error: true,
        errorMsg: "Choose a valid date"
      });
    } else if (!error) {
      this.setState({isOpen: false});
      //Send back docVersionDate
      this.props.sendDocVersionDate(docVersionDate);
    }
  };

  render = () => {
    const errorMsg = this.state.error ? this.state.errorMsg : '';
    return (
      <ConfirmModal show={this.state.isOpen}
                    title={T("Enter the Document Version Date")}
                    onOK={this.closeModal.bind(this)}
                    onOKLabel={T("Ok")}
                    onClose={() => this.setState({isOpen: false})}
                    onCloseLabel={T("Cancel")} >
        <FieldDate name="docVersionDate" value={this.state.docVersionDate} 
                   readOnly={false}
                   onChange={this.onDocVersionDateChange.bind(this)} />
        <div className="input-feedback">{errorMsg}</div>
      </ConfirmModal>
    );
  }
};

export default PromptDocVersionDate;