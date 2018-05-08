import React from 'react';
import FieldDocType from './FieldDocType';
import {getDocTypeFromLocalType} from '../../utils/DocTypesHelper';
import {T} from '../../utils/i18nHelper';
import ConfirmModal from '../utils/ConfirmModal';

class PromptDocType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isOpen: this.props.isOpen || false,
        docType: '',
        aknType: '',
        error: false
    }
    this.validationSchema = props.validationSchema;
  }

  onDocTypeChange(evt) {
    const docType = evt.target.value;
    this.validationSchema['docType'].validate.validate(docType)
    .then((docType) => {
      const aknType = getDocTypeFromLocalType(docType).aknType;
      this.setState({docType, aknType, error:false});
    }).catch(err => {
      this.setState({error: true});
    })
  }

  closeModal = () => {
    const {error, docType, aknType} = this.state;
    if (!error && docType.length > 0) {
      this.setState({isOpen: false});
      //Send back docType and aknType
      this.props.sendDocTypes(docType, aknType);
    }
    else {
      this.setState({error: true});
    }
  };

  render = () => {
    const error = this.state.error ? 'Choose a valid document type' : '';
    return (
      <ConfirmModal show={this.state.isOpen}
                    title={T("Enter the Document Type")}
                    onOK={this.closeModal}
                    onOKLabel={T("Ok")} >
        <FieldDocType name="docType" value={this.state.docType} 
                      readOnly={false} 
                      onChange={this.onDocTypeChange.bind(this)} />
        <div className="input-feedback">{error}</div>
      </ConfirmModal>
    );
  }
};

export default PromptDocType;