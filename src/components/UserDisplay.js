import React, { Component } from 'react';
import { Container, Button, Input } from 'reactstrap';

export default class UserDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            id: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onSubmit() {
        this.props.addMember(this.state.name);
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
                >Add User</Button>
            </Container>
        );
    }
}
