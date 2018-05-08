import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
//import Spinner from 'react-spinkit';
//import ReactModal from 'react-modal';

class ConfirmModal extends React.Component {

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
            {
              onCloseLabel
              ? <Button color="secondary" onClick={onClose}>{onCloseLabel}</Button>
              : ''
            }
          </ModalFooter>
        </Modal>
      </div>
    );
  }
};

// show, onClose, title, onOK, onOKLabel, onCloseLabel
ConfirmModal.propTypes =  {
  show: PropTypes.bool,
  title: PropTypes.string,
  onOK: PropTypes.func,
  onClose: PropTypes.func,
  onOKLabel: PropTypes.string,
  onCloseLabel: PropTypes.string
};


export default ConfirmModal;