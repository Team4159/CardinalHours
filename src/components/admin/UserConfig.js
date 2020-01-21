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

import UserStore from '../../state/UserStore'
import DB from '../../state/DB';

export default class UserConfig extends Component {
    constructor(props) {
        super(props);

        let user_names = DB.users.map(user => user.name);

        this.state = {
            users: user_names,
            search_value: '',
            selected_user_file_name: null,
            selected_user_name: null,
            selected_user_id: null,
        };

        this.handleSelectUser = this.handleSelectUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDropUser = this.handleDropUser.bind(this);
        this.handleSaveUser = this.handleSaveUser.bind(this);
    }

    handleSaveUser() {
        let user = DB.query({
            name: this.state.selected_user_file_name
        });

        user.name = this.state.selected_user_name;
        user.id = this.state.selected_user_id;

        DB.updateUser(this.state.selected_user_file_name, user);
    }

    handleDropUser() {
        let users = this.state.users.filter(user => user !== this.state.selected_user_file_name);

        let dropped_user = DB.query({
            name: this.state.selected_user_file_name
        });

        this.setState({
            users: users,
            selected_user_file_name: null,
            selected_user_name: null,
            selected_user_id: null,
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
                selected_user_file_name: user.name,
                selected_user_name: user.name,
                selected_user_id: user.id
            });
        } else {
            log.error('User not found:' + name);
        }
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
                    this.state.selected_user_file_name ?
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
                                    onClick={this.handleSaveUser}>{`Save Changes to ${this.state.selected_user_name}`}</Button>
                            {' '}
                            <Button color='danger' onClick={this.handleDropUser}>Drop User</Button>
                        </div> : null
                }
                <br/>
            </div>
        )
    }
}