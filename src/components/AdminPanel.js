import React, {Component} from 'react';
import {
    Button,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Pagination,
    PaginationItem,
    PaginationLink,
    Badge
} from 'reactstrap';
import ReactModal from "react-modal";
import DB from '../state/DB'
import CounterConfig from "./admin/CounterConfig";
import MiscConfig from "./admin/MiscConfig";
import UserConfig from "./admin/UserConfig";
import Input from "reactstrap/es/Input";

export default class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            unlocked: false,
            passwordInput: "",
            showModal: false,
            pagination: "COUNTER",
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);

        this.resetConfig = this.resetConfig.bind(this);
        this.handlePagination = this.handlePagination.bind(this);

        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    }

    resetConfig() {
        DB.writeToFile({...require("../state/default_config")})
        this.forceUpdate();
    }

    handleOpenModal() {
        this.setState({
            unlocked: DB.isPasswordNotSet(),
            passwordInput: "",
            showModal: true
        });
    }

    handleCloseModal() {
        this.setState({
            showModal: false
        });
    }

    handlePagination(event, pagination) {
        this.setState({
            pagination: pagination
        });
    }

    handlePasswordChange(event) {
        this.setState({
            passwordInput: event.target.value
        })
    }

    handlePasswordSubmit(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();

            this.setState({
                unlocked: DB.checkPassword(this.state.passwordInput)
            });
        }
    }

    render() {
        return (
            <div>
                <Button onClick={this.handleOpenModal}>Admin Panel</Button>
                <ReactModal
                    isOpen={this.state.showModal}
                    ariaHideApp={false}
                    contentLabel="Admin Panel"
                    style={{
                        content: {
                            height: '90%',
                            width: '90%',
                            margin: '0 auto',
                        }
                    }}
                >
                    {
                        this.state.unlocked ?
                            <div>
                                {
                                    DB.isPasswordNotSet() ?
                                        <div>
                                            <Badge color="danger" pill>!</Badge>
                                            <small> No password set!</small>
                                        </div> : null
                                }
                                <Pagination size="sm">
                                    <PaginationItem active={this.state.pagination === "COUNTER"}>
                                        <PaginationLink href='#' onClick={event => this.handlePagination(event, "COUNTER")}>
                                            Counter Configuration
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem active={this.state.pagination === "USERS"}>
                                        <PaginationLink href='#' onClick={event => this.handlePagination(event, "USERS")}>
                                            User Configuration
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem active={this.state.pagination === "MISC"}>
                                        <PaginationLink href='#' onClick={event => this.handlePagination(event, "MISC")}>
                                            Miscellaneous Options
                                        </PaginationLink>
                                    </PaginationItem>
                                </Pagination>
                                <div>
                                    {
                                        this.state.pagination === "COUNTER" ? <CounterConfig/> :
                                            this.state.pagination === "USERS" ? <UserConfig/> :
                                                this.state.pagination === "MISC" ? <MiscConfig refresh={this.props.refresh}/> : null
                                    }
                                </div>
                                <br/>
                                <Button
                                    color="warning"
                                    onClick={this.resetConfig}
                                >Reset</Button>
                                {' '}
                                <Button
                                    onClick={this.handleCloseModal}
                                >Exit</Button>
                            </div>
                            :
                            <div>
                                 <InputGroup>
                                    <InputGroupAddon addonType="prepend"><InputGroupText>Password</InputGroupText></InputGroupAddon>
                                    <Input type="password" value={this.state.passwordInput} onChange={this.handlePasswordChange} onKeyDown={this.handlePasswordSubmit}/>
                                </InputGroup>
                            </div>
                    }

                </ReactModal>
            </div>
        );
    }
}
