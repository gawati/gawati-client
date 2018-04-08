import React from 'react';
import {Row, Col, Container} from 'reactstrap';


class StdContainer extends React.Component {
    render() {
        const {children} = this.props; 
        return 
            (
            <Container fluid>
                {children}
            </Container>
            );
    }
};

export default StdContainer ;