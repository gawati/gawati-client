import React from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';

class ConfirmDialog extends React.Component {

  render() {
    const {
        okLabbel = 'OK',
        cancelLabel = 'Cancel',
        title,
        confirmation,
        show,
        proceed,
        dismiss,
        cancel,
        enableEscape = true,
      } = this.props;      
    return (
      <div className="static-modal">
        <Modal show={show} onHide={dismiss} keyboard={true} className={this.props.className} backdrop={true}>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            {confirmation}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={proceed}>Transit</Button>{' '}
            <Button color="secondary" onClick={cancel}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
;


export default confirmable(ConfirmDialog);