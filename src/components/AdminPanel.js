import React, { Component } from 'react';
import {Button, Input} from 'reactstrap';
import ReactModal from "react-modal";
import DB from '../state/DB'
//import config from '../state/config.json';
import moment from "moment";
import fs from 'fs';


export default class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            config: {},
            hour_counters: {},
            day_counters: {},
            showModal: false,
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);

        this.handleHourCounter = this.handleHourCounter.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.setDate = this.setDate.bind(this);
    }

    componentWillMount() {
        const config = DB.config;

        const format = key => Object.keys(config[key]).reduce((acc, cur) => {
            acc[cur] = false;
            return acc;
        }, {});

        let hourCounters = format("hour_counters");
        let dayCounters = format("day_counters");

        this.setState({
            config: config,
            hour_counters: hourCounters,
            day_counters: dayCounters
        });
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    handleClick(counter, key) {
        let obj = {};

        if (counter) {
            obj[key] = !this.state.hour_counters[key];

            this.setState({
                hour_counters: {
                    ...this.state.hour_counters,
                    ...obj
                }
            })
        } else {
            obj[key] = !this.state.day_counters[key];

            this.setState({
                day_counters: {
                    ...this.state.day_counters,
                    ...obj
                }
            })
        }
    }

    handleHourCounter(event, key) {
        //console.log(key + ": " + event);
    }

    setDate(event) {
        /**event.preventDefault();

        let start = moment(this.state.startDate).format('YYYY-MM-DD');
        let end = moment(this.state.endDate).format('YYYY-MM-DD');

        if (start === "Invalid date" || end === "Invalid date") return false;

        let config = this.state.config;
        //config.hour_counters[this.state.period][0] = start;
        //config.hour_counters[this.state.period][1] = end;

        this.writeToFile(config);**/
    }

    writeToFile(newConfig) {
        this.setState({config: newConfig});
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
                    style = {{
                        content: {
                            height : '50%',
                            width  : '50%',
                            margin : '0 auto',
                        }
                    }}
                >
                    {
                        Object.keys(this.state.config.hour_counters).map((key, idx) => (
                            [<Button onClick={() => this.handleClick("hour_counters", key)}>{key}</Button>, <br key={idx}/>]
                        ))
                    }

                    {
                        Object.keys(this.state.config.day_counters).map((key, idx) => (
                            [<Button onClick={key => this.handleClick("day_counters", key)}>{key}</Button>, <br key={idx + this.state.config.hour_counters.length}/>]
                        ))
                    }

                    {
                        Object.keys(this.state.config.hour_counters).filter(key => this.state.hour_counters[key]).map((key, idx) => (
                            <div key={idx}>
                                <form onSubmit={this.setDate}>
                                    <Input
                                        name="start_date"
                                        placeholder={key + " start date"}
                                        value={this.state.config.hour_counters[key][0]}
                                        onChange={key => this.handleHourCounter(event, key)}
                                    />
                                    <Input
                                        name="start_date"
                                        placeholder={key + " end date"}
                                        value ={this.state.config.hour_counters[key][1]}
                                        onChange={key => this.handleHourCounter(event, key)}
                                    />
                                    <Button
                                        onClick={this.setDate}
                                        type='submit'
                                    >Submit</Button>
                                </form>
                            </div>))
                    }

                    {/**
                        this.state.showSetDate ?
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
                            </div>
                        : null **/
                    }
                    <button
                        onClick={this.handleCloseModal}
                    >Close</button>
                </ReactModal>
            </div>
        );
    }
}