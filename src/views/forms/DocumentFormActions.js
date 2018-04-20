import React from 'react';

import {Card, CardBody, ButtonGroup, Button} from 'reactstrap';
import RRNavLink from '../../components/utils/RRNavLink';
import {linkDocumentAdd} from '../../components/utils/QuickRoutes';


export const DocumentFormActions = ({lang}) => {
    return(
        <Card className={`bg-white text-right mt-1 mb-1`}>
           <CardBody className={`pt-0 pb-0 pl-0 pr-0`}>
           <ButtonGroup>
                 <Button className="btn btn-link"><RRNavLink to={ linkDocumentAdd(lang) }><i className="fa fa-plus"></i> Add Document</RRNavLink></Button>
            </ButtonGroup>
            </CardBody>
        </Card>        
    );
};



