import React, { Component } from 'react';
import {Button, Input, Row} from 'reactstrap';
import ReactModal from "react-modal";
import DB from '../state/DB'
import UserDisplay from './UserDisplay';
let source = DB.config_filename;
import moment from "moment";
import fs from 'fs';


export default class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            showSetDate: false,
            addStudents: DB.config.sign_ups,
            startDate: '',
            endDate: '',
            period: "Build Season Hours",
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.setDate = this.setDate.bind(this);
    }
    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }


    toggleSetDate(){
        this.setState({showSetDate: !this.state.showSetDate})
    }
    toggleAddStudents(){
        this.setState({addStudents: !this.state.addStudents})
        DB.config.sign_ups = this.state.addStudents;
        fs.writeFile(source, JSON.stringify(DB.config), (err) =>{if(err) return console.log(err)});
        console.log(DB.config);
    }
    setDate(event){
        event.preventDefault();


        let s = moment(this.state.startDate).format('YYYY-MM-DD');
        let e = moment(this.state.endDate).format('YYYY-MM-DD');

        if (s === "Invalid date" || e === "Invalid date"){
            console.log(s);
            console.log(e);
            return null;
        }
        //console.log(s);
        // console.log(e);
        console.log(s);
        console.log(e);
        let config = DB.config;
        config.hour_counters[this.state.period][0] = s;
        config.hour_counters[this.state.period][1] = e;
        //let source=  './src/state/default_config.json';
        fs.writeFile(source, JSON.stringify(config), (err) =>{if(err) return console.log(err)});
        console.log(DB.config);
    }
    dropUser(user){
        const dropper = DB.query({user});

    }


    render() {
        return (
            <div>
                <Button onClick={this.handleOpenModal}>Admin Panel</Button>
                <ReactModal
                    isOpen={this.state.showModal}
                    ariaHideApp={false}
                    contentLabel="Admin Panel"
                    style = {{
                        content: {
                            height : '50%',
                            width  : '50%',
                            margin : '0 auto',
                        }
                    }}
                >
                    <Button
                        onClick={this}
                        className='memberTable'
                    >Drop members
                    </Button>
                    <div></div>
                    <Button
                        className='buildDate'
                        onClick={this.toggleSetDate.bind(this)}
                    >
                        Change build season start and end date
                    </Button>
                    {this.state.showSetDate ?
                        <div> <form onSubmit={this.setDate}>
                            <Input
                                name='startDate'
                                placeholder='Enter build season start date'
                                value = {this.state.startDate}
                                onChange = {this.handleChange}
                            />
                            <Input
                                name='endDate'
                                placeholder='Enter build season end date'
                                value = {this.state.endDate}
                                onChange = {this.handleChange}
                            />
                            <Button
                                onClick={this.setDate}
                                type='submit'
                            >Enter</Button> </form>
                        </div>    : null}
                    <div></div>
                    <div>Add new users</div>
                    <div></div>
                    <Button
                        className="offButton"
                        onClick={this.toggleAddStudents.bind(this)}
                        style = {{
                                color: !this.state.addStudents ? "green" : "red"
                        }}

                    >{!this.state.addStudents ? "On" : "Off"}</Button>
                    <div></div>
                    <button
                        onClick={this.handleCloseModal}
                    >Close</button>
                </ReactModal>
                {DB.config.sign_ups ? <Row style={ { height: '25%' } }>
                        <UserDisplay/>
                    </Row> : null }
            </div>
        );
    }
}