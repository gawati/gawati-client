import React from 'react';

import {Card, CardBody, ButtonGroup, Button} from 'reactstrap';
import RRNavLink from '../../components/utils/RRNavLink';
import {linkDocumentAdd} from '../../components/utils/QuickRoutes';
import { docWorkflowTransitions, docOfficialDate, docCreatedDate, docModifiedDate } from '../../utils/PkgHelper';
import { getRolesForCurrentClient } from '../../utils/GawatiAuthClient';

class DocumentFormActions extends React.Component {
    constructor(props) {
        super(props);
        //const {pkg} = props;
        //this.state = pkg;
    }

    
/*     componentWillReceiveProps (nextProps) {
        //if (nextProps.text !== this.props.text) {
       ///     this.setState({text: nextProps.text});
       /// }
       const {pkg} = nextProps;
       console.log(" PKG WILL RECEIVE ", pkg);
       this.setState(pkg);
    }
 */
    getWorkflowTransitions() {
        // get current roles 
        // get available transition
        // check if current roles can transit to transition
        const pkg = this.state; 
        const roles = getRolesForCurrentClient();
        console.log(" ROLES == ", roles);
        const transitions = docWorkflowTransitions(pkg);
        console.log(" TRANSITIONS == ", pkg, transitions);
    }


    render() {
        const {lang, pkg} = this.props;
        //const pkg = this.state;
        console.log(" PKG = ", pkg) ;
        return(
            <Card className={`text-white bg-info text-right mt-1 mb-1 doc-toolbar-actions`}>
               <CardBody className={`pt-0 pb-0 pl-0 pr-0`}>
               <ButtonGroup>
                   {/** using Button here injects btn-secondary for some unknown reason so using <button> directly **/}

                    <button className={`btn btn-primary`}><RRNavLink to={ linkDocumentAdd(lang) }><i className="fa fa-plus"></i> Add Document</RRNavLink></button>
                </ButtonGroup>
                </CardBody>
            </Card>        
        );
            
    }
};

export default DocumentFormActions;
