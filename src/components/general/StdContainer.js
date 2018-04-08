import React from 'react';
import {Container} from 'reactstrap';

/**
 * This Component renders the main fluid container part of  a document content page, 
 * and is typically rendered inside StdCompContainer
 * 
 * @class StdContainer
 * @extends {React.Component}
 */
class StdContainer extends React.Component {
    render() {
        const {children} = this.props; 
        return  (
            <Container fluid>
                {children}
            </Container>
            );
    }
};

export default StdContainer ;