import React, { Component, Fragment } from 'react';
import Select from 'react-dropdown-select';
import {
    Button,
    ButtonGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';

import log from 'electron-log';

import SessionsInput from './SessionsInput';

import DB from '../../../state/DB';

export default class UserConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            names: DB.getUserNames(),
            original_name: null,

            name: null,
            id: null,
            sessions: null,

            selected_pane: 'user_details',
        };

        this.handleChange = this.handleChange.bind(this);

        this.handleSelectUser = this.handleSelectUser.bind(this);
        this.handleSaveUser = this.handleSaveUser.bind(this);
        this.handleDropUser = this.handleDropUser.bind(this);

        this.handleAddSession = this.handleAddSession.bind(this);
        this.handleRemoveSession = this.handleRemoveSession.bind(this);

        this.handleSetPane = this.handleSetPane.bind(this);

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    handleSelectUser(name) {
        const user = DB.query({
            name: name
        });

        if (user) {
            this.setState({
                original_name: user.name,

                name: user.name,
                id: user.id,
                sessions: user.sessions,

                sessions_opened: false,
            });
        } else {
            log.error('User not found: ' + name);
        }
    }

    handleSaveUser() {
        DB.setUser(
            this.state.original_name,
            this.state.name,
            this.state.id,
            this.state.sessions
        );

        this.setState({
            names: DB.getUserNames(),
            original_name: this.state.name,
        });
    }

    handleDropUser() {
        DB.dropUser(this.state.original_name);

        this.setState( {
            names: DB.getUserNames(),
            original_name: null,

            name: null,
            id: null,
            sessions: null,
        });
    }

    handleAddSession(session) {
        const user = {
            name: this.state.original_name,
        };

        DB.addSession(user, session);

        this.handleSelectUser(this.state.original_name);
    }

    handleRemoveSession(session) {
        const user = {
            name: this.state.original_name,
        };

        DB.removeSession(user, session);

        this.handleSelectUser(this.state.original_name);
    }

    handleSetPane(event) {
        this.setState({
            selected_pane: event.target.name,
        });
    }

    render() {
        return (
            <Fragment>
                <Select
                    options=
                        {
                            this.state.names.reduce((acc, cur) => {
                                acc.push({
                                    label: cur,
                                });
                                return acc
                            }, [])
                        }
                    onChange={value => this.handleSelectUser(value[0].label)}
                />
                <br/>
                {
                    this.state.original_name ?
                        <Fragment>
                            <ButtonGroup>
                                <Button
                                    outline
                                    active={ this.state.selected_pane === 'user_details' }
                                    color='primary'
                                    name='user_details'
                                    onClick={ this.handleSetPane }
                                >
                                    User Details
                                </Button>
                                <Button
                                    outline
                                    active={ this.state.selected_pane === 'sessions_editor' }
                                    color='primary'
                                    name='sessions_editor'
                                    onClick={ this.handleSetPane }
                                >
                                    Sessions Editor
                                </Button>
                            </ButtonGroup>
                            {
                                this.state.selected_pane === 'sessions_editor' ?
                                    <SessionsInput
                                        sessions={ this.state.sessions }
                                        handleRemoveSession={ this.handleRemoveSession }
                                        handleAddSession={ this.handleAddSession }
                                    /> :
                                    <div>
                                        <InputGroup>
                                            <InputGroupAddon
                                                addonType='prepend'><InputGroupText>Name</InputGroupText></InputGroupAddon>
                                            <Input value={ this.state.name }
                                                   name='name'
                                                   onChange={ this.handleChange }/>
                                        </InputGroup>
                                        <InputGroup>
                                            <InputGroupAddon
                                                addonType='prepend'><InputGroupText>ID</InputGroupText></InputGroupAddon>
                                            <Input value={ this.state.id }
                                                   name='id'
                                                   onChange={ this.handleChange }/>
                                        </InputGroup>
                                        <br/>
                                        <Button color='success'
                                                onClick={ this.handleSaveUser }
                                        >
                                            { "Save Changes to " + this.state.name }
                                        </Button>
                                        {' '}
                                        <Button color='danger' onClick={ this.handleDropUser }>Drop User</Button>
                                        <br/>
                                    </div>
                            }
                            <br/>
                        </Fragment> : <h5>Select a User!</h5>
                }

            </Fragment>
        )
    }
}