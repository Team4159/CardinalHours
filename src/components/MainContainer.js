import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import TimeTable from './TimeTable';
import LastActionDisplay from './LastActionDisplay';
import AdminPanel from "./AdminPanel";

export default class MainContainer extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Container className='MainContainer'>
                <h1 className='Header'>CardinalHours</h1>
                <Row>
                    <Col>
                        <AdminPanel/>
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
