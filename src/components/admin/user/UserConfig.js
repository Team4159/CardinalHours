import React, {Component} from 'react';
import Select from 'react-dropdown-select';
import {
    Button,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';

import log from 'electron-log';

import SessionsConfig from './SessionsConfig';

import DB from '../../../state/DB';

export default class UserConfig extends Component {
    constructor(props) {
        super(props);

        let user_names = DB.users.map(user => user.name);

        this.state = {
            users: user_names,
            search: '',

            user_original_name: null,
            user_name: null,
            user_id: null,
            user_sessions: null,
        };

        this.handleSelectUser = this.handleSelectUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDropUser = this.handleDropUser.bind(this);
        this.handleSaveUser = this.handleSaveUser.bind(this);

        this.handleRemoveSession = this.handleRemoveSession.bind(this);
        this.handleAddSession = this.handleAddSession.bind(this);
    }

    handleSaveUser() {
        let user = DB.query({
            name: this.state.user_original_name
        });

        user.name = this.state.user_name;
        user.id = this.state.user_id;

        DB.updateUser(this.state.user_original_name, user);
    }

    handleDropUser() {
        let user_names = this.state.users.filter(user => user !== this.state.user_original_name);

        let dropped_user = DB.query({
            name: this.state.user_original_name
        });

        this.setState({
            users: user_names,

            user_original_name: null,
            user_name: null,
            user_id: null,
            user_sessions: null,

            sessions_opened: false,
        });

        DB.dropUser(dropped_user);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSelectUser(name) {
        let user = DB.query({
            name: name
        });

        if (user) {
            this.setState({
                user_original_name: user.name,
                user_name: user.name,
                user_id: user.id,
                user_sessions: user.sessions,
                sessions_opened: false,
            });
        } else {
            log.error('User not found:' + name);
        }
    }

    handleRemoveSession(removed_session) {
        let updated_sessions = this.state.user_sessions;
        updated_sessions.splice(this.state.user_sessions.findIndex(session => session.end === removed_session.end), 1);

        this.setState({
            user_sessions: updated_sessions
        });
    }

    handleAddSession(start, end) {
        const session = {
            start: start,
            end: end
        };

        let updated_sessions = this.state.user_sessions;
        updated_sessions.push(session);

        this.setState({
            user_sessions: updated_sessions
        })
    }

    render() {
        return (
            <div>
                <Select
                    options={this.state.users.reduce((acc, cur) => {
                        acc.push({
                            label: cur,
                        });
                        return acc
                    }, [])}
                    onChange={value => this.handleSelectUser(value[0].label)}
                />
                <br/>
                {
                    this.state.user_original_name ?
                        <div>
                            <InputGroup>
                                <InputGroupAddon
                                    addonType='prepend'><InputGroupText>Name</InputGroupText></InputGroupAddon>
                                <Input value={this.state.user_name}
                                       name='user_name'
                                       onChange={this.handleChange}/>
                            </InputGroup>
                            <br/>
                            <InputGroup>
                                <InputGroupAddon
                                    addonType='prepend'><InputGroupText>ID</InputGroupText></InputGroupAddon>
                                <Input value={this.state.user_id}
                                       name='user_id'
                                       onChange={this.handleChange}/>
                            </InputGroup>
                            <br/>
                            <SessionsConfig
                                sessions={this.state.user_sessions}
                                handleRemoveSession={this.handleRemoveSession}
                                handleAddSession={this.handleAddSession}
                            />
                            <br/>
                            <Button color='success'
                                    onClick={this.handleSaveUser}>{`Save Changes to ${this.state.user_name}`}</Button>
                            {' '}
                            <Button color='danger' onClick={this.handleDropUser}>Drop User</Button>
                            <br/>
                        </div> : null
                }
                <br/>
            </div>
        )
    }
}