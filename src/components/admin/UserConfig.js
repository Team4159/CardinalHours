import React, {Component} from 'react';
import Select from 'react-dropdown-select'
import {
    Button,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';

import log from 'electron-log';

import UserStore from '../../state/UserStore'
import DB from '../../state/DB';

export default class UserConfig extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            users: DB.users,
            search_value: '',
            selected_user: null,
            selected_user_name: null,
            selected_user_id: null,
        });

        this.handleSelectUser = this.handleSelectUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDropUser = this.handleDropUser.bind(this);
        this.handleSaveChangesToUser = this.handleSaveChangesToUser.bind(this);
        this.handleSaveAllChanges = this.handleSaveAllChanges.bind(this);
    }

    componentWillMount() {
        this.setState({
            users: DB.users
        });
    }

    handleSaveAllChanges() {
        let drops = DB.users.filter(user => this.state.users.includes(local_user => local_user.name === user.name));
        for (let drop of drops) {
            UserStore.signOutUser(drop);
        }

        DB.setAndUpdateUsersFile(this.state.users);
    }

    handleSaveChangesToUser() {
        let user = this.state.selected_user;

        user['name'] = this.state.selected_user_name;
        user['id'] = this.state.selected_user_id;

        let users = this.state.users;
        users[this.state.users.indexOf(this.state.selected_user)] = user;

        this.setState({
            users: users,
        });
    }

    handleDropUser() {
        let users = this.state.users.filter(user => user !== this.state.selected_user);

        this.setState({
            users: users,
            selected_user: null,
            selected_user_name: null,
            selected_user_id: null,
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSelectUser(user) {
        if (user) {
            this.setState({
                selected_user: user,
                selected_user_name: user.name,
                selected_user_id: user.id
            });
        } else {
            log.error('User not found:' + user);
        }
    }

    render() {
        return (
            <div>
                <Select
                    options={this.state.users}
                    valueField='name'
                    labelField='name'
                    clearable={true}
                    separator={true}
                    closeOnSelect={true}
                    onChange={value => this.handleSelectUser(value[0])}
                />
                <br/>
                {
                    this.state.selected_user ?
                        <div>
                            <InputGroup>
                                <InputGroupAddon
                                    addonType='prepend'><InputGroupText>Name</InputGroupText></InputGroupAddon>
                                <Input value={this.state.selected_user_name}
                                       name='selected_user_name'
                                       onChange={this.handleChange}/>
                            </InputGroup>
                            <br/>
                            <InputGroup>
                                <InputGroupAddon
                                    addonType='prepend'><InputGroupText>ID</InputGroupText></InputGroupAddon>
                                <Input value={this.state.selected_user_id}
                                       name='selected_user_id'
                                       onChange={this.handleChange}/>
                            </InputGroup>
                            <br/>
                            <Button color='success'
                                    onClick={this.handleSaveChangesToUser}>{`Save Changes to ${this.state.selected_user['name']}`}</Button>
                            {' '}
                            <Button color='danger' onClick={this.handleDropUser}>Drop User</Button>
                        </div> : null
                }
                <br/>
                <Button color='success' onClick={this.handleSaveAllChanges}>Confirm All Changes</Button>
            </div>
        )
    }
}