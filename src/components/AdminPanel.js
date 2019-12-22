import React, {Component} from 'react';
import { Button, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import ReactModal from "react-modal";
import DB from '../state/DB'
import fs from 'fs';
import CounterConfig from "./admin/CounterConfig";
import MiscConfig from "./admin/MiscConfig";

const source = DB.config_filename;

export default class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            pagination: "COUNTER",
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.resetConfig = this.resetConfig.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
    }

    resetConfig() {
        DB.writeToFile({...require("../state/default_config")})
        this.forceUpdate();
    }

    handleOpenModal() {
        this.setState({
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
        })
    }

    writeToFile() {
        fs.writeFile(source, JSON.stringify(this.state.config), err => err ? console.error(err) : null);
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
                            height: '50%',
                            width: '50%',
                            margin: '0 auto',
                        }
                    }}
                >
                    <Pagination>
                        <PaginationItem active={this.state.pagination === "COUNTER"}>
                            <PaginationLink href='#' onClick={event => this.handlePagination(event, "COUNTER")}>
                                Counters
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem active={this.state.pagination === "MISC"}>
                            <PaginationLink href='#' onClick={event => this.handlePagination(event, "MISC")}>
                                Misc. Options
                            </PaginationLink>
                        </PaginationItem>
                    </Pagination>
                    <div>
                        {
                            this.state.pagination === "COUNTER" ? <CounterConfig/> :
                            this.state.pagination === "MISC" ? <MiscConfig refresh={this.props.refresh}/> : null
                            //TODO: Users
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
                </ReactModal>
            </div>
        );
    }
}