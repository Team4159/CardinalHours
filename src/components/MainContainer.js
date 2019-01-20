import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import TimeTable from './TimeTable';
import UserDisplay from './UserDisplay';

export default class MainContainer extends Component {
    render() {
        return (
            <Container>
              <h1>CardinalHours</h1>
              <Row>
                <Col>
                    <UserDisplay/>
                </Col>
                <Col>
                    <TimeTable/>
                </Col>
              </Row>
            </Container>
        )
    }
}
