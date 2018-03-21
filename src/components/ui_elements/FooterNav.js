import React from 'react';
import { NavLink } from 'react-router-dom';

import { Container, Row, Col, Nav, NavItem } from 'reactstrap';

class FooterNav extends React.Component {
    render() {

        return (
        <Container fluid={ true }>
        <Row><Col>Gawati Client<Nav pills>
            <NavItem>
                <NavLink to="/">Link</NavLink>
            </NavItem>
            <NavItem>
                <NavLink to="/">Link</NavLink>
            </NavItem>
        </Nav></Col></Row>

        </Container>
        );
    }
}

export default FooterNav;