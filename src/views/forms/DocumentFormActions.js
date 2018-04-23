import React from 'react';

import {Card, CardBody, ButtonGroup, Button} from 'reactstrap';
import RRNavLink from '../../components/utils/RRNavLink';
import {linkDocumentAdd} from '../../components/utils/QuickRoutes';


export const DocumentFormActions = ({lang}) => {
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
};



