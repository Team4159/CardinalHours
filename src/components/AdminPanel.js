import React, { Component } from 'react';
import {Button} from 'reactstrap';
import Container from "reactstrap/es/Container";
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
                <button onClick={this.handleOpenModal}>Admin Panel</button>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Admin Panel"
                    style = {{
                        content: {
                            height : '50%',
                            width  : '50%',
                            margin : '0 auto',
                        }
                    }}
                >
                    <Button className='memberTable'>
                        View times/drop members
                    </Button>
                    <Button className='buildDate'>
                        Change build season start and end date
                    </Button>
                    <button onClick={this.handleCloseModal}>Close</button>
                </ReactModal>
            </div>
        );
    }
}