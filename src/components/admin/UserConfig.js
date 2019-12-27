import React, {Component} from 'react';
import DB from "../../state/DB";
import {Button, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import Select from "react-dropdown-select"

export default class UserConfig extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            users: DB.users,
            searchValue: '',
            selectedUser: null,
            selectedUserName: null,
            selectedUserID: null,
        });

        this.handleSelectUser = this.handleSelectUser.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleIDChange = this.handleIDChange.bind(this);
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
        DB.setUsers(this.state.users);
        DB.updateFile();
    }

    handleSaveChangesToUser() {
        let user = {
            ...this.state.selectedUser,
            ...{'name': this.state.selectedUserName},
            ...{'id': this.state.selectedUserID}
        };

        let users = this.state.users;
        users[this.state.users.indexOf(this.state.selectedUser)] = user;

        this.setState({
            users: users,
        })
    }

    handleDropUser() {
        let users = this.state.users.filter(user => user !== this.state.selectedUser);

        this.setState({
            users: users,
            selectedUser: null,
            selectedUserName: null,
            selectedUserID: null,
        })
    }

    handleNameChange(event) {
        this.setState({
            selectedUserName: event.target.value
        })
    }

    handleIDChange(event) {
        this.setState({
            selectedUserID: event.target.value
        })
    }

    handleSelectUser(user) {
        if (user) {
            this.setState({
                selectedUser: user,
                selectedUserName: user.name,
                selectedUserID: user.id
            })
        } else {
            console.error("User not found:" + user)
        }
    }

    render() {
        return (
            <div>
                <Select
                    options={this.state.users}
                    valueField="name"
                    labelField="name"
                    clearable={true}
                    separator={true}
                    closeOnSelect={true}
                    onChange={(value) => this.handleSelectUser(value[0])}
                />
                <br/>
                {
                    this.state.selectedUser ?
                        <div>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend"><InputGroupText>Name</InputGroupText></InputGroupAddon>
                                <Input value={this.state.selectedUserName} onChange={this.handleNameChange}/>
                            </InputGroup>
                            <br/>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend"><InputGroupText>ID</InputGroupText></InputGroupAddon>
                                <Input value={this.state.selectedUserID} onChange={this.handleIDChange}/>
                            </InputGroup>
                            <br/>
                            <Button color="success" onClick={this.handleSaveChangesToUser}>{`Save Changes to ${this.state.selectedUser['name']}`}</Button>
                            {' '}
                            <Button color="danger" onClick={this.handleDropUser}>Drop User</Button>
                        </div> : null
                }
                <br/>
                <Button color="success" onClick={this.handleSaveAllChanges}>Confirm All Changes</Button>
            </div>
        )
    }
}