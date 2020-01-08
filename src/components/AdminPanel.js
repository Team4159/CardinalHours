import React, {Component} from 'react';
import ReactModal from 'react-modal';
import {
    Button,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Pagination,
    PaginationItem,
    PaginationLink,
    Badge
} from 'reactstrap';

import CounterConfig from './admin/CounterConfig';
import MiscConfig from './admin/MiscConfig';
import UserConfig from './admin/UserConfig';

import DB from '../state/DB'

export default class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            unlocked: false,
            password_input_value: '',
            show_modal: false,
            pagination: 'COUNTER',
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);

        this.resetConfig = this.resetConfig.bind(this);
        this.handlePagination = this.handlePagination.bind(this);

        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    }

    resetConfig() {
        DB.setAndUpdateConfigFile(require('../state/default_config'));
        this.setState({
            show_modal: false
        });
    }

    handleOpenModal() {
        this.setState({
            unlocked: DB.isPasswordNotSet(),
            password_input_value: '',
            show_modal: true
        });
    }

    handleCloseModal() {
        this.setState({
            show_modal: false
        });
    }

    handlePagination(event, pagination) {
        this.setState({
            pagination: pagination
        });
    }

    handlePasswordChange(event) {
        this.setState({
            password_input_value: event.target.value
        });
    }

    handlePasswordSubmit(event) {
        if (event.key === 'Enter') {
            event.stopPropagation();

            this.setState({
                unlocked: DB.verifyPassword(this.state.password_input_value)
            });
        } else if (event.key === 'Escape') {
            event.stopPropagation();
            this.handleCloseModal();
        }
    }

    render() {
        return (
            <div>
                <Button onClick={this.handleOpenModal}>Settings</Button>
                <ReactModal
                    isOpen={this.state.show_modal}
                    ariaHideApp={false}
                    contentLabel='Admin Panel'
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
                                            <Badge color='danger' pill>!</Badge>
                                            <small> No password set!</small>
                                            <br/>
                                        </div> : null
                                }
                                <Pagination size='sm'>
                                    <PaginationItem active={this.state.pagination === 'COUNTER'}>
                                        <PaginationLink href='#'
                                                        onClick={event => this.handlePagination(event, 'COUNTER')}>
                                            Counter Configuration
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem active={this.state.pagination === 'USERS'}>
                                        <PaginationLink href='#'
                                                        onClick={event => this.handlePagination(event, 'USERS')}>
                                            User Configuration
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem active={this.state.pagination === 'MISC'}>
                                        <PaginationLink href='#'
                                                        onClick={event => this.handlePagination(event, 'MISC')}>
                                            Miscellaneous Options
                                        </PaginationLink>
                                    </PaginationItem>
                                </Pagination>
                                <div>
                                    {
                                        this.state.pagination === 'COUNTER' ? <CounterConfig/> :
                                            this.state.pagination === 'USERS' ? <UserConfig/> :
                                                this.state.pagination === 'MISC' ? <MiscConfig/> :
                                                    null
                                    }
                                </div>
                                <br/>
                                <Button
                                    color='danger'
                                    onClick={this.resetConfig}
                                >Reset</Button>
                                {' '}
                            </div>
                            :
                            <div>
                                <InputGroup>
                                    <InputGroupAddon
                                        addonType='prepend'><InputGroupText>Password</InputGroupText></InputGroupAddon>
                                    <Input type='password' value={this.state.password_input_value}
                                           onChange={this.handlePasswordChange} onKeyDown={this.handlePasswordSubmit}/>
                                </InputGroup>
                            </div>
                    }
                    <Button
                        onClick={this.handleCloseModal}
                    >Exit</Button>
                </ReactModal>
            </div>
        );
    }
}
