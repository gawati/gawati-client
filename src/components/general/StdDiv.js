import React from 'react';
import {Row, Col} from 'reactstrap';

class StdDiv extends React.Component {

    render() {
        const {children} = this.props;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12" lg="12" className="doc-container-padding-0" >
                        {children}
                    </Col>
                </Row>
            </div>
        );
    }

}

export default StdDiv ; 
