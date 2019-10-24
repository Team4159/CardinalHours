import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import TimeTable from './TimeTable';
import UserDisplay from './UserDisplay';
import LastActionDisplay from './LastActionDisplay';
import AdminPanel from "./AdminPanel";

import config from '../state/config.json';

export default class MainContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container className='MainContainer'>
                <h1>CardinalHours</h1>
                <AdminPanel/>
                <h1 className='Header'>CardinalHours</h1>
                <Row>
                    <Col>
                        { config.sign_ups ? <Row style={ { height: '25%' } }>
                            <UserDisplay/>
                        </Row> : null }
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
