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
import ButtonGroup from "reactstrap/es/ButtonGroup";

const edge_format = 'MMM Do, YYYY HH:mm a';

export default class SessionsInput extends Component {
    constructor(props) {
        super(props);

        const today = moment().format("MM-DD-YYYY");

        this.state = {
            date: today,
            hours: '',

            selected_pane: 'remove',
        };

        this.handleTogglePane = this.handleTogglePane.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddSession = this.handleAddSession.bind(this);
    }

    handleAddSession() {
        if (moment(this.state.date).isValid()) {
            this.props.handleAddSession({
                start: moment(this.state.date).toISOString(),
                end: moment(this.state.date).add(this.state.hours, 'hours').toISOString()
            });

            this.setState({
                hours: ''
            })
        }
    }

    handleTogglePane(event) {
        this.setState({
            selected_pane: event.target.name
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return <React.Fragment>
            {
                <div>
                    <div>
                        <ButtonGroup>
                            <Button size='sm'
                                outline
                                active={ this.state.selected_pane === 'add' }
                                name='add'
                                onClick={this.handleTogglePane}>Add</Button>
                            <Button size='sm'
                                    outline
                                    active={ this.state.selected_pane === 'remove' }
                                    name='remove'
                                    onClick={this.handleTogglePane}>Remove</Button>
                            <Button size='sm'
                                    disabled>
                                Sessions
                            </Button>
                        </ButtonGroup>
                        {
                            this.state.selected_pane === 'add' ?
                                <div>
                                    <InputGroup>
                                        <InputGroupAddon addonType='prepend'>
                                            <InputGroupText>Date of Session</InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            name='date'
                                            value={ this.state.date }
                                            onChange={ this.handleChange }
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputGroupAddon addonType='prepend'>
                                            <InputGroupText># of Hours</InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            type='number'
                                            name='hours'
                                            value={ this.state.hours }
                                            onChange={ this.handleChange }
                                        />
                                    </InputGroup>
                                    <Button outline
                                            color={ this.state.date === '' || moment(this.state.date).isValid() ? 'success' : 'danger' }
                                            disabled={ !moment(this.state.date).isValid() }
                                            size='sm'
                                            onClick={ this.handleAddSession }>
                                        Add This Session
                                    </Button>
                                </div> :
                                <div>
                                    {
                                        this.props.sessions.map((session, idx) =>
                                            <div key={idx}>
                                                {
                                                    moment(session.start).format(edge_format) + " - " +
                                                    moment(session.end).format(edge_format) + " "
                                                }
                                                <Badge>
                                                    {
                                                        moment(session.end)
                                                            .diff(moment(session.start), 'hours', true)
                                                            .toFixed(2) + " Hours "
                                                    }
                                                </Badge>
                                                {' '}
                                                <Button outline
                                                        size='sm'
                                                        color='danger'
                                                        onClick={ e => this.props.handleRemoveSession(session) }>
                                                    Remove Session
                                                </Button>
                                            </div>
                                        )
                                    }
                                    {
                                        this.props.sessions.length === 0 ?
                                            <h6>No Sessions</h6> : null
                                    }
                                </div>
                        }

                    </div>
                </div>
            }

        </React.Fragment>
    }
}