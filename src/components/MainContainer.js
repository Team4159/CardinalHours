import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import TimeTable from './TimeTable';
import UserDisplay from './UserDisplay';
import LastActionDisplay from './LastActionDisplay';

import UserStore from '../state/UserStore';

export default class MainContainer extends Component {
    constructor(props) {
        super(props);

        this.UserStore = new UserStore();
        this.DB = this.UserStore.DB;
    }

    render() {
        return (
            <Container className='MainContainer'>
                <h1>CardinalHours</h1>
                <Row>
                    <Col>
                        <Row>
                            <UserDisplay
                                UserStore={ this.UserStore }
                                DB = { this.DB }
                            />
                        </Row>
                        <Row>
                            <LastActionDisplay
                                UserStore={ this.UserStore }
                                DB = { this.DB }
                            />
                        </Row>
                    </Col>
                    <Col>
                        <TimeTable
                            UserStore={ this.UserStore }
                            DB = { this.DB }
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}
