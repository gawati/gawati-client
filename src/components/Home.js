import React from 'react';
import { Container, Col, Row } from 'reactstrap';

import DataEntryFormHolder from './DataEntryFormHolder';

export const Home = ({match, i18n}) => 
    <Container>
        <Row>
           <Col>
             <DataEntryFormHolder match={match} i18n={i18n} />
           </Col>
         </Row>   
    </Container>
    ;

