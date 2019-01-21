import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import TimeTable from './TimeTable';
import UserDisplay from './UserDisplay';

export default class MainContainer extends Component {
    constructor(props){
        super(props);

        this.state=({
            members: [{
                    name: "Rishi Nath",
                    id: "20050682",
                    time_in: 32,
                    signed_in: true
                },
                {
                    name: "Kai Chang",
                    id: "42042042",
                    time_in: 5,
                    signed_in: false
                }],
            sign_in: '',
        });

        this.addMember = this.addMember.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    addMember(member, id) {
        this.state.members.push({
            name: member,
            id: id,
            time_in: 0,
            signed_in: true
        })
    }
    handleKeyPress(event) {
        if (event.which === 13){
            let arr = [];
            for(const i in this.state.members) if(this.state.members[i].id === this.state.sign_in) arr.push(i);

            if (arr.length > 0){
                let newMembers = this.state.members;
                newMembers[arr[0]].signed_in = !newMembers[arr[0]].signed_in;
                this.setState({members: newMembers})
            }

            this.setState({sign_in: ''});
        } else {
            this.setState({
                sign_in: this.state.sign_in + String.fromCharCode(event.which)
            })
        }

    }

    componentDidMount(){document.addEventListener("keypress", this.handleKeyPress, false);}
    componentWillUnmount(){document.removeEventListener("keypress", this.handleKeyPress, false);}

    render() {
        return (
            <Container>
              <h1>CardinalHours</h1>
              <Row>
                <Col>
                    <UserDisplay addMember={this.addMember}/>
                </Col>
                <Col>
                    <TimeTable members={this.state.members}/>
                </Col>
              </Row>
            </Container>
        )
    }
}
