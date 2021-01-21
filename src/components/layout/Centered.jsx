import React from 'react';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export const centerIt = (comp) => {
    return (
        <Container className="h-100">
            <Row className="h-100">
                <Col />
                <Col xs={12} lg={6} className="align-self-center">
                {comp}
                </Col>
                <Col />
            </Row>
        </Container>
    );
}
export const centeredComp = (WrappedComponent) => {
    return class extends React.Component {

        render() {
            return centerIt(<WrappedComponent {...this.props} />);
        }
    };
}


