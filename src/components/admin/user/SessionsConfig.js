import React, { Component } from "react";
import moment from "moment";
import {
    Button,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Badge
} from 'reactstrap';

const edge_format = 'MMM Do, YYYY HH:mm a';

export default class SessionsConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_showing: false,
            is_adding: false,

            date: '',
            hours: '',
        };

        this.handleToggle = this.handleToggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddSession = this.handleAddSession.bind(this);
    }

    handleAddSession() {
        if (moment(this.state.date).isValid()) {
             this.props.handleAddSession(moment(this.state.date).toISOString(),
                                         moment(this.state.date).add(this.state.hours, 'hours').toISOString());

             this.setState({
                 date: '',
                 hours: ''
             })
        }
    }

    handleToggle(event) {
        this.setState({
            [event.target.name]: !this.state[event.target.name]
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return <React.Fragment>
            <Button name='is_showing'
                    onClick={this.handleToggle}>Edit Sessions</Button>
            {
                this.state.is_showing ?
                    <div>
                        <div>
                            <Button size='sm'
                                    name='is_adding'
                                    onClick={this.handleToggle}>Add/Remove Sessions</Button>
                            {
                                this.state.is_adding ?
                                    <div>
                                        <InputGroup>
                                            <InputGroupAddon addonType='prepend'>
                                                <InputGroupText>Date of Session</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                name='date'
                                                value={this.state.date}
                                                onChange={this.handleChange}
                                            />
                                        </InputGroup>
                                        <InputGroup>
                                            <InputGroupAddon addonType='prepend'>
                                                <InputGroupText># of Hours</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                type='number'
                                                name='hours'
                                                value={this.state.hours}
                                                onChange={this.handleChange}
                                            />
                                        </InputGroup>
                                        <Button outline
                                                color={ this.state.date === '' || moment(this.state.date).isValid() ? 'success' : 'danger' }
                                                size='sm'
                                                onClick={this.handleAddSession}>
                                            Add This Session
                                        </Button>
                                    </div> :
                                    <div>
                                        {
                                            this.props.sessions.map((session, idx) =>
                                                <div key={idx}>
                                                    {
                                                        moment(session.start).format(edge_format) + " - " + moment(session.end).format(edge_format) + " "
                                                    }
                                                    <Badge>
                                                        {
                                                            moment(session.end).diff(moment(session.start), 'hours', true).toFixed(2) + " Hours "
                                                        }
                                                    </Badge>
                                                    {' '}
                                                    <Button outline
                                                            size='sm'
                                                            color='danger'
                                                            onClick={e => this.props.handleRemoveSession(session)}>
                                                        Remove Session
                                                    </Button>
                                                </div>
                                            )
                                        }
                                    </div>
                            }

                        </div>
                    </div> : null
            }

        </React.Fragment>
    }
}