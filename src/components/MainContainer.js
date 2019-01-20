import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import TimeTable from './TimeTable';
import UserDisplay from './UserDisplay';

export default class MainContainer extends Component {
    constructor(props){
        super(props);

        this.state=({
            signed_in: Array(100).fill(undefined).map(_ => Object.assign({}, {
                name: 'Robotics Member',
                time_in: 0
            }))
        })

        this.addMember = this.addMember.bind(this);
    }

    addMember(member) {
        this.state.signed_in.push({
            name: member,
            time_in: 0
        })
    }

    render() {
        return (
            <Container>
              <h1>CardinalHours</h1>
              <Row>
                <Col>
                    <UserDisplay addMember={this.addMember}/>
                </Col>
                <Col>
                    <TimeTable signed_in={this.state.signed_in}/>
                </Col>
              </Row>
            </Container>
        )
    }
}
