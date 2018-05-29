import React from 'react';

import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {Aux} from '../utils/GeneralHelper';
import { T } from '../utils/i18nHelper';

class DeleteAction extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        modal: false
    }
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }
  render() {
    const {action,docPkg,deleteDoc,linkIri} = this.props;
    return (<span>
              <Aux><Button className="btn btn-info" role="button" onClick= {this.toggleModal.bind(this)} >{T(action.label)}</Button>&#160;</Aux>
              <Modal isOpen={this.state.modal} >
               <ModalHeader >Modal title</ModalHeader>
               <ModalBody>Are you sure you want to delete the selected document?</ModalBody>
               <ModalFooter>
                 <Button color="primary" onClick={this.toggleModal.bind(this)} >No</Button>{' '}
                 <Button color="secondary" onClick={() => deleteDoc(linkIri,docPkg.akomaNtoso.attachments.value)}>Yes</Button>
               </ModalFooter>
              </Modal>
            </span>
    )        
  }
}

export default DeleteAction;