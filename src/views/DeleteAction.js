import React from 'react';
import { T } from '../utils/i18nHelper';
import ConfirmModal from './utils/ConfirmModal';
import {Button} from 'reactstrap';

class DeleteAction extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        isOpen: false
    }
  }

  toggleModal() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    const {action,deleteDoc,linkIri} = this.props;
    return (<span><Button className="btn btn-info" role="button" onClick= {this.toggleModal.bind(this)} >{T(action.label)}</Button>
            <ConfirmModal show={this.state.isOpen}
                onClose={this.toggleModal.bind(this)}
                title={T("Are you sure you want to delete the selected document?")}
                onOK={() => deleteDoc(linkIri)}
                onOKLabel={T("Ok")} 
                onCloseLabel={T("Cancel")} >
                The Document will be deleted !
            </ConfirmModal>                  
            </span>
    )        
  }
}

export default DeleteAction;