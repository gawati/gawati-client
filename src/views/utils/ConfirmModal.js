import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';
//import ReactModal from 'react-modal';

class ConfirmModal extends React.Component {
  constructor () {
    super();
  }

  render () {
    const {show, onClose, title, onOK, onOKLabel, onCloseLabel, children} = this.props;
    return (
      <div>
        <Modal isOpen={show}>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            {children}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={onOK}>{onOKLabel}</Button>{' '}
            <Button color="secondary" onClick={onClose}>{onCloseLabel}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
};



export default ConfirmModal;