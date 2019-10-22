import React, { Component } from 'react';
import { Container, Button, Input } from 'reactstrap';

import UserStore from '../state/UserStore';

export default class UserDisplay extends Component {
    constructor(props) {
        super(props);

        this.UserStore = UserStore.getInstance();

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

    onSubmit(e) {
        e.preventDefault();

        const user = {
            name: this.state.name,
            id: this.state.id
        };

        if (this.UserStore.addUser(user)) {
            this.UserStore.signInUser(user);
        } else {
            alert('Student ID Already Taken!');
        }

        this.setState({
            name: '',
            id: ''
        });
    }

    render() {
        return (
            <Container className='UserDisplay'>
                <form onSubmit={ this.onSubmit }>
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
                </form>
            </Container>
        );
    }
}
