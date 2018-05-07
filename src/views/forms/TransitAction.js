import React from 'react';
import {Aux} from '../../utils/GeneralHelper';
import {T} from '../../utils/i18nHelper';
import ConfirmModal from '../utils/ConfirmModal';

class TransitAction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    closeModal = () => {
        this.setState({
            isOpen: false
        });
    };

    openModal = () => {
        this.setState({
            isOpen: true
        });
    };

    render = () => {
        // transition props 
        const {from, to, icon, name, title } = this.props.transition;
        const {pkg, transitAction} = this.props;
        const {isOpen} = this.state;
        return (
            <Aux>
                <ConfirmModal show={isOpen} 
                    title={T("Transiting Document")}
                    onClose={this.closeModal} 
                    onOK={
                        ()=> {
                            this.closeModal();
                            transitAction(pkg, from, to, name);
                        }
                    }
                    onOKLabel={T("Confirm")}
                    onCloseLabel={T("Close")}
                    >
                    {T(`Are you sure you want to transit the document from the state ${from} to the state ${to} ?`)}
                </ConfirmModal>            
                <button className={`btn btn-warning`} 
                    onClick={
                        () => {   
                            this.openModal();
                        }  
                    }>
                    <i className={`fa ${icon}`}></i> {T(title)}
                </button>&#160;        
            </Aux>
        );

    
    }
};

export default TransitAction;