import React, { Component } from 'react';
import {Button} from 'reactstrap';
import ReactModal from "react-modal";

export default class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }
    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <div>
                <Button onClick={ this.handleOpenModal }>Admin Panel</Button>
                <ReactModal
                    isOpen={ this.state.showModal }
                    contentLabel="Admin Panel"
                    style = {{
                        content: {
                            height : '50%',
                            width  : '50%',
                            margin : '0 auto',
                        }
                    }}
                >
                    <Button>View times/drop members</Button>
                    <br/>
                    <Button>Change build season start and end date</Button>
                    <br/>
                    <Button onClick={ this.handleCloseModal }>Close</Button>
                </ReactModal>
            </div>
        );
    }
}
