import React, {Component} from 'react';
import {
    Badge,
    Button,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';

import ConfigStore from '../../../state/ConfigStore';
import DB from '../../../state/DB';

export default class MiscConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sign_ups: DB.isSignUpsEnabled(),
            old_password: '',
            new_password: '',
            confirm_password: '',
            show_password_input: false,
        };

        this.toggleSignUps = this.toggleSignUps.bind(this);
        this.togglePasswordInput = this.togglePasswordInput.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);

        ConfigStore.onUpdatePassword(_ => {
            this.setState({
                old_password: '',
                new_password: '',
                confirm_password: ''
            });
        });

        ConfigStore.onToggleSignUps(enabled => {
            this.setState({
                sign_ups: enabled,
            });
        });
    }

    toggleSignUps() {
        ConfigStore.toggleSignUps();
    }

    togglePasswordInput() {
        this.setState({
            show_password_input: !this.state.show_password_input,
        });
    }

    handlePasswordChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handlePasswordSubmit() {
        if (this.state.new_password === this.state.confirm_password && (DB.isPasswordNotSet() || DB.verifyPassword(this.state.old_password))) {
            ConfigStore.updatePassword(this.state.new_password);
        }
    }

    render() {
        return (
            <div>
                <Button
                    outline
                    onClick={this.toggleSignUps}
                    color={this.state.sign_ups ? 'primary' : 'secondary'}
                >Sign Ups {
                    this.state.sign_ups ?
                        <Badge color='success' pill>Enabled</Badge>

                        : <Badge color='dark' pill>Disabled</Badge>
                }
                </Button>
                <br/>
                <Button
                    onClick={this.togglePasswordInput}
                >Change Password</Button>
                {
                    this.state.show_password_input ?
                        <div>
                            {
                                DB.isPasswordNotSet() ? null :
                                    <InputGroup>
                                        <InputGroupAddon addonType='prepend'>
                                            <InputGroupText>Current Password</InputGroupText>
                                        </InputGroupAddon>
                                        <Input type='password'
                                               value={this.state.old_password}
                                               name='old_password'
                                               onChange={e => this.handlePasswordChange(e, 'old_password')}/>
                                    </InputGroup>
                            }

                            <InputGroup>
                                <InputGroupAddon addonType='prepend'>
                                    <InputGroupText>New Password</InputGroupText>
                                </InputGroupAddon>
                                <Input type='password'
                                       value={this.state.new_password}
                                       name='new_password'
                                       onChange={e => this.handlePasswordChange(e, 'new_password')}/>
                            </InputGroup>
                            <InputGroup>
                                <InputGroupAddon addonType='prepend'>
                                    <InputGroupText>Confirm New Password</InputGroupText>
                                </InputGroupAddon>
                                <Input type='password'
                                       value={this.state.confirm_password}
                                       name='confirm_password'
                                       onChange={e => this.handlePasswordChange(e, 'confirm_password')}/>
                            </InputGroup>
                            <Button size='sm' onClick={this.handlePasswordSubmit}
                                    color={this.state.new_password !== '' && this.state.new_password === this.state.confirm_password ? 'success' : 'warning'}>{DB.isPasswordNotSet() ? 'Set Password' : 'Submit New Password'}</Button>
                        </div> : null
                }
            </div>
        );
    }
}