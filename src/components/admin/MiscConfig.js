import React, {Component} from 'react';
import DB from "../../state/DB";
import {Badge, Button, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";

export default class MiscConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            oldPasswordInput: "",
            newPasswordInput: "",
            confirmPasswordInput: "",
            showPasswordInputs: false,
        };

        this.toggleSignUps = this.toggleSignUps.bind(this);
        this.togglePasswordInput = this.togglePasswordInput.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    }

    toggleSignUps() {
        DB.writeToFile({...DB.config, ...{"sign_ups": !DB.config.sign_ups}});
        this.props.refresh();
    }

    togglePasswordInput() {
        this.setState({
            showPasswordInputs: !this.state.showPasswordInputs,
        })
    }

    handlePasswordChange(event, inputName) {
        this.setState({
            [inputName]: event.target.value
        })
    }

    handlePasswordSubmit(event) {
        if (this.state.newPasswordInput === this.state.confirmPasswordInput && (DB.isPasswordNotSet || DB.checkPassword(this.state.oldPasswordInput))) {
            DB.setPassword(this.state.newPasswordInput);

            this.setState({
                oldPasswordInput: "",
                newPasswordInput: "",
                confirmPasswordInput: ""
            })
        }
    }

    render() {
        return (
            <div>
                <Button
                    outline
                    onClick={this.toggleSignUps}
                    color={DB.config.sign_ups ? "primary" : "secondary"}
                >Sign Ups {DB.config.sign_ups ?
                    <Badge color="success" pill>Enabled</Badge>
                    :<Badge color="dark" pill>Disabled</Badge>}
                </Button>
                <br/>
                <Button
                    onClick={this.togglePasswordInput}
                >Change Password</Button>
                {
                    this.state.showPasswordInputs ?
                        <div>
                            {
                                DB.isPasswordNotSet() ? null :
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend"><InputGroupText>Current Password</InputGroupText></InputGroupAddon>
                                    <Input type="password" value={this.state.oldPasswordInput} onChange={e => this.handlePasswordChange(e, "oldPasswordInput")}/>
                                </InputGroup>
                            }
                            <InputGroup>
                                <InputGroupAddon addonType="prepend"><InputGroupText>New Password</InputGroupText></InputGroupAddon>
                                <Input type="password" value={this.state.newPasswordInput} onChange={e => this.handlePasswordChange(e, "newPasswordInput")}/>
                            </InputGroup>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend"><InputGroupText>Confirm New Password</InputGroupText></InputGroupAddon>
                                <Input type="password" value={this.state.confirmPasswordInput} onChange={e => this.handlePasswordChange(e, "confirmPasswordInput")}/>
                            </InputGroup>
                            <Button size="sm" onClick={this.handlePasswordSubmit} color={this.state.newPasswordInput === this.state.confirmPasswordInput ? "success" : "warning"}>{DB.isPasswordNotSet() ? "Set Password" : "Submit New Password"}</Button>
                        </div> : null
                }
            </div>
        );
    }
}