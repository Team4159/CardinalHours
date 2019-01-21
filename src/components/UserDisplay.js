import React, { Component } from 'react';
import { Container, Button, Input } from 'reactstrap';

import UserStore from '../state/UserStore';
import DB from '../state/DB';

export default class UserDisplay extends Component {
    constructor(props) {
        super(props);

        this.UserStore = UserStore.getInstance();
        this.DB = DB.getInstance();

        this.state = {
            name: '',
            id: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onSubmit() {
        const user = {
            name: this.state.name,
            id: this.state.id
        };

        if (this.UserStore.addUser(user)) {
            this.UserStore.signInUser(user);
        }

        this.setState({
            name: '',
            id: ''
        });
    }

    render() {
        return (
            <Container className='UserDisplay'>
                <Input
                    name='name'
                    placeholder='Name'
                    value={ this.state.name }
                    onChange={ this.handleChange }
                />
                <Input
                    name='id'
                    placeholder='Student ID'
                    value={ this.state.id }
                    onChange={ this.handleChange }
                />
                <Button
                    color='light'
                    onClick={ this.onSubmit }
                >Add New User</Button>
            </Container>
        );
    }
}
