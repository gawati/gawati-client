import React from 'react';

import { Container, Row, Col } from 'reactstrap';

import { versionInfo } from "../../utils/AppVersionHelper";

class FooterNav extends React.Component {


    render() {
        console.log(" VERSION INFO ", versionInfo());
        return (
        <Container fluid={ true }>
        <Row><Col>{versionInfo().name} = {versionInfo().version}</Col></Row>
        </Container>
        );
    }
}

export default FooterNav;