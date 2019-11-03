import React, {Component} from 'react';
import {Button, Input, Badge } from 'reactstrap';
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
        this.toggleSignUps = this.toggleSignUps.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isConfigValid = this.isConfigValid.bind(this);
        this.resetConfig = this.resetConfig.bind(this);
    }

    componentWillMount() {
        const config = DB.config;

        const format = key => Object.keys(config[key]).reduce((acc, cur) => {
            acc[cur] = false;
            return acc;
        }, {});

        let hour_counters = format("hour_counters");
        let day_counters = format("day_counters");

        this.setState({
            config: config,
            hour_counters: hour_counters,
            day_counters: day_counters,
        });
    }

    resetConfig() {
        this.setState({
            config: {...require("../state/default_config")}
        });

        this.writeToFile();
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

    toggleSignUps() {
        this.setState({
            config: {
                ...this.state.config,
                sign_ups: !this.state.config.sign_ups,
            }
        });
    }

    isConfigValid() {
        return Object.values({...this.state.config.hour_counters, ...this.state.config.day_counters}).every(
            counter => counter.constructor === Array ? counter.every(date => moment(date).isValid()) : typeof counter === "number")
    }

    handleClick(type, counter) {
        this.setState({
            [type]: {
                ...this.state[type],
                [counter]: !this.state[type][counter]
            }
        })
    }

    handleChange(event, type, counter, pos) {
        let obj = {
            [type]: {}
        };

        if (pos === undefined) {
            obj[type][counter] = parseInt(event.target.value) || 0;
        } else {
            obj[type][counter] = [...this.state.config[type][counter]];
            obj[type][counter][pos] = event.target.value;
        }

        this.setState({
            config: {
                ...this.state.config,
                ...obj
            }
        })
    }

    handleSubmit(event) {
        if (this.isConfigValid()) {
            this.writeToFile();
        } else {
            event.preventDefault();
        }
    }

    writeToFile() {
        fs.writeFile(source, JSON.stringify(this.state.config), err => err ? console.error(err) : null);
    }

    dropUser(user) {
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
                    style={{
                        content: {
                            height: '50%',
                            width: '50%',
                            margin: '0 auto',
                        }
                    }}
                >
                    <form
                        style={{
                            display: "inline",
                        }}
                        onSubmit={this.handleSubmit}>
                        Hour Counters
                        <div>
                            {
                                Object.keys(this.state.config.hour_counters).map((counter, idx) => (
                                    [<Button
                                        outline
                                        color="primary"
                                        onClick={() => this.handleClick("hour_counters", counter)}>
                                        {counter}
                                    </Button>,
                                        <br key={idx}/>,
                                        this.state.hour_counters[counter] ?
                                            <div key={idx + this.state.config.hour_counters.length}>
                                                <Input
                                                    name="start_date"
                                                    placeholder={counter + " start date"}
                                                    value={this.state.config.hour_counters[counter][0]}
                                                    onChange={event => this.handleChange(event, "hour_counters", counter, 0)}
                                                />
                                                <Input
                                                    name="start_date"
                                                    placeholder={counter + " end date"}
                                                    value={this.state.config.hour_counters[counter][1]}
                                                    onChange={event => this.handleChange(event, "hour_counters", counter, 1)}
                                                />
                                            </div> : null]
                                ))
                            }
                        </div>
                        Day Counters
                        <div>
                            {
                                Object.keys(this.state.config.day_counters).map((counter, idx) => (
                                    [<Button outline
                                             color="primary"
                                             onClick={() => this.handleClick("hour_counters", counter)}>
                                        {counter}
                                    </Button>,
                                        <br key={idx}/>,
                                        this.state.hour_counters[counter] ?
                                            <div key={idx + this.state.config.hour_counters.length}>
                                                <Input
                                                    placeholder={"Day of " + counter}
                                                    value={this.state.config.day_counters[counter]}
                                                    onChange={event => this.handleChange(event, "day_counters", counter)}
                                                />
                                                <p>
                                                    {moment().isoWeekday(this.state.config.day_counters[counter]).format("dddd")}
                                                </p>
                                            </div> : null]
                                ))
                            }
                        </div>
                        User Settings
                        <div>
                            <Button
                                outline
                                color="primary"
                                className='memberTable'
                            >Drop members
                            </Button>
                        </div>
                        Misc. Options
                        <div>
                            <Button
                                outline
                                className="offButton"
                                onClick={this.toggleSignUps}
                                color={this.state.config.sign_ups ? "primary" : "secondary"}
                            >Sign Ups {this.state.config.sign_ups ?
                                <Badge color="success" pill>Enabled</Badge>
                                :<Badge color="dark" pill>Disabled</Badge>}
                            </Button>
                        </div>
                        <hr/>
                        <Button
                            type='submit'
                            color={this.isConfigValid() ? "success" : "danger"}
                        >Confirm</Button>
                    </form>
                    {' '}
                    <Button
                        color="warning"
                        onClick={this.resetConfig}
                    >Reset</Button>
                    {' '}
                    <Button
                        onClick={this.handleCloseModal}
                    >Cancel</Button>
                </ReactModal>
            </div>
        );
    }
}