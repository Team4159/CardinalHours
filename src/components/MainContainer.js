import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import TimeTable from './TimeTable';
import UserDisplay from './UserDisplay';
import LastActionDisplay from './LastActionDisplay';

import UserStore from '../state/UserStore';
import MockDB from '../state/MockDB';

export default class MainContainer extends Component {
    constructor(props) {
        super(props);

        this.UserStore = new UserStore();
        this.DB = new MockDB();
    }

    componentDidMount() {
        this.UserStore.onAddUser(user => {
            this.DB.addUser(user);
        });

        this.UserStore.onSignOutUser(user => {
            this.DB.addTime(user, user.time_in);
        });
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
