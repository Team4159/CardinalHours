import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import TimeTable from './TimeTable';
import UserDisplay from './UserDisplay';
import LastActionDisplay from './LastActionDisplay';
import AdminPanel from "./AdminPanel";

import DB from '../state/DB';

export default class MainContainer extends Component {
    constructor(props) {
        super(props);

        this.refreshMainContainer = this.refreshMainContainer.bind(this);
    }

    refreshMainContainer() {
        this.forceUpdate();
    }

    render() {
        return (
            <Container className='MainContainer'>
                <h1 className='Header'>CardinalHours</h1>
                <Row>
                    <Col>
                        <Row style={ { height: '10%' } }>
                            <AdminPanel refresh={this.refreshMainContainer}/>
                        </Row>
                        { DB.config.sign_ups ? <Row style={ { height: '25%' } }>
                            <UserDisplay/>
                        </Row> : null }
                        <Row style={ { height: '65%' } }>
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
