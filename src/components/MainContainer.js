import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import TimeTable from './TimeTable';
import UserDisplay from './UserDisplay';
import LastActionDisplay from './LastActionDisplay';
import AdminPanel from "./AdminPanel";

export default class MainContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container className='MainContainer'>
                <h1>CardinalHours</h1>
                <AdminPanel/>
                <Row>
                    <Col>
                        <Row style={ { height: '25%' } }>
                            <UserDisplay/>
                        </Row>
                        <Row style={ { height: '75%' } }>
                            <LastActionDisplay/>
                        </Row>
                    </Col>
                    <Col>
                        <TimeTable/>
                    </Col>
                </Row>
            </Container>
        )
    }
}
