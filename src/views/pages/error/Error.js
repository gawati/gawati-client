import React from 'react';
import { Container, Row, Col, CardGroup, Card, CardBody } from 'reactstrap';

export const StartupError = ({message}) =>  {
    console.log(" StartupError == ", message);
    return (
        <div className="app flex-row align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col md="8">
                    <CardGroup>
                        <Card className="p-4">
                        <CardBody>
                            <h2> There was an error starting up </h2>
                            <p> {message} </p>
                        </CardBody>
                        </Card>
            {/*                     <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                        <CardBody className="text-center">
                            <SignUp history={history} />
                        </CardBody>
                        </Card> */}
                    </CardGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
;