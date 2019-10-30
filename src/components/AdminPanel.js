import React, {Component} from 'react';
import {Button, Input} from 'reactstrap';
import ReactModal from "react-modal";
import DB from '../state/DB'
import moment from "moment";
import fs from 'fs';

const source = DB.config_filename;

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
        this.handleDayCounter = this.handleDayCounter.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        const config = DB.config;

        console.log(config);

        const format = key => Object.keys(config[key]).reduce((acc, cur) => {
            acc[cur] = false;
            return acc;
        }, {});

        let hour_counters = format("hour_counters");
        let day_counters = format("day_counters");

        this.setState({
            config: config,
            hour_counters: hour_counters,
            day_counters: day_counters
        });
    }

    handleOpenModal() {
        this.setState({showModal: true});
    }

    handleCloseModal() {
        this.setState({showModal: false});
    }

    handleClick(counter, key) {
        let obj = {};

        if (counter === "hour_counters") {
            obj[key] = !this.state.hour_counters[key];

            this.setState({
                hour_counters: {
                    ...this.state.hour_counters,
                    ...obj
                }
            })
        } else if (counter === "day_counters") {
            obj[key] = !this.state.day_counters[key];

            this.setState({
                day_counters: {
                    ...this.state.day_counters,
                    ...obj
                }
            })
        }
    }

    handleHourCounter(event, counter, pos) {
        let obj = { hour_counters: {} };

        obj.hour_counters[counter] = [...this.state.config.hour_counters[counter]];
        obj.hour_counters[counter][pos] = event.target.value;

        this.setState({
            config: {
                ...this.state.config,
                ...obj
            }
        });
    }

    handleDayCounter(event, counter) {
        let obj = { day_counters: {} };

        obj.day_counters[counter] = parseInt(event.target.value) || 0;

        this.setState({
            config: {
                ...this.state.config,
                ...obj
            }
        })
    }

    handleSubmit(event) {
        if (Object.values({...this.state.config.hour_counters, ...this.state.config.day_counters}).every(
            counter => counter.constructor === Array ? counter.every(date => moment(date).isValid()) : moment().isoWeekday(counter).isValid())) {
            this.writeToFile();
        } else {
            return false;
        }
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
                    <form onSubmit={this.handleSubmit}>
                        {
                            Object.keys(this.state.config.hour_counters).map((key, idx) => (
                                [<Button onClick={() => this.handleClick("hour_counters", key)}>{key}</Button>,
                                    <br key={idx}/>,
                                    this.state.hour_counters[key] ? <div key={idx + this.state.config.hour_counters.length}>
                                        <Input
                                            name="start_date"
                                            placeholder={key + " start date"}
                                            value={this.state.config.hour_counters[key][0]}
                                            onChange={event => this.handleHourCounter(event, key, 0)}
                                        />
                                        <Input
                                            name="start_date"
                                            placeholder={key + " end date"}
                                            value={this.state.config.hour_counters[key][1]}
                                            onChange={event => this.handleHourCounter(event, key, 1)}
                                        />
                                    </div> : null]
                            ))
                        }

                        {
                            Object.keys(this.state.config.day_counters).map((key, idx) => (
                                [<Button onClick={() => this.handleClick("hour_counters", key)}>{key}</Button>,
                                    <br key={idx}/>,
                                    this.state.hour_counters[key] ? <div key={idx + this.state.config.hour_counters.length}>
                                        <Input
                                            placeholder={"Day of " + key}
                                            value={this.state.config.day_counters[key]}
                                            onChange={event => this.handleDayCounter(event, key)}
                                        />
                                        <p>
                                            {
                                                moment().isoWeekday(this.state.config.day_counters[key]).format("dddd")
                                            }
                                        </p>
                                    </div> : null]
                            ))
                        }
                        <Button
                            type='submit'
                        >Submit</Button>
                    </form>
                    <Button
                        onClick={this.handleCloseModal}
                    >Close</Button>
                </ReactModal>
            </div>
        );
    }
}