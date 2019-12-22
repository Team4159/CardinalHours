import React, {Component} from 'react';
import DB from "../../state/DB";
import moment from "moment";
import {Button, Input} from "reactstrap";
import ReactModal from "../AdminPanel";

export default class CounterConfig extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            config: DB.config,
            hour_counters: {},
            day_counters: {}
        });

        this.isConfigValid = this.isConfigValid.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        event.preventDefault();
        if (this.isConfigValid()) {
            DB.writeToFile(this.state.config);
        }
    }

    render() {
        return (
            <div>
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
                <br/>
                <Button
                    type='submit'
                    color={this.isConfigValid() ? "success" : "danger"}
                    onClick={this.handleSubmit}
                >Save Changes</Button>
            </div>
        )
    }
}