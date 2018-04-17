import React from 'react';

import {Card, CardBody, ButtonGroup, Button, NavLink} from 'reactstrap';
import {linkDocumentAdd} from '../../components/utils/QuickRoutes';



export const DocumentFormActions = ({lang}) => {
    return(
        <Card className="bg-white text-right mt-1 mb-1">
        <CardBody className="pt-0 pb-0 pl-0 pr-0">
            <ButtonGroup>
                <Button type="button" className={ `btn btn-link` } >
                    <NavLink to={ linkDocumentAdd(lang) }>
                            <i className="fa fa-plus"></i> Add Document
                    </NavLink>
                </Button>
                <Button type="button" className={ `btn btn-link` } onClick={ () => console.log(" Hello World!")}>
                    Select All
                </Button>
            </ButtonGroup>                
        </CardBody>
        </Card>
    );
};



