import React, {Component} from 'react';
import {
    Container,
    Row,
    Col
} from 'reactstrap';

import TimeTable from './TimeTable';
import UserDisplay from './UserDisplay';
import LastActionDisplay from './LastActionDisplay';
import AdminPanel from './AdminPanel';

import ConfigStore from '../state/ConfigStore';
import DB from '../state/DB';

export default class MainContainer extends Component {
    constructor(props) {
        super(props);

        ConfigStore.onRefreshMainContainer(_ =>
            this.forceUpdate(),
        );
    }

    render() {
        return (
            <Container className='MainContainer'>
                <Row>
                    <Col>
                        <h1 className='Header'>CardinalHours</h1>
                    </Col>
                    <Col>
                        <Row style={{height: '10%', marginTop: 10}}>
                            <Col xs='8'>
                            </Col>
                            <Col xs='4'>
                                <AdminPanel/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {
                            DB.config.sign_ups ?
                            <Row style={{height: '25%'}}>
                            <UserDisplay/>
                            </Row> : null
                        }
                        <Row style={{height: '65%'}}>
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
