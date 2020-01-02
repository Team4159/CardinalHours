import React, {Component} from 'react';
import {
    Button,
    Input,
    InputGroup
} from 'reactstrap';

import moment from 'moment';

import DB from '../../state/DB';

export default class CounterConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hour_counters: {},
            day_counters: {}
        };

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

        let hour_counters = format('hour_counters');
        let day_counters = format('day_counters');

        this.setState({
            config: config,
            hour_counters: hour_counters,
            day_counters: day_counters,
        });
    }

    isConfigValid() {
        return Object.values({...this.state.config.hour_counters, ...this.state.config.day_counters}).every(
            counter => counter.constructor === Array ? counter.every(date => moment(date).isValid()) : typeof counter === 'number');
    }

    handleClick(type, counter) {
        this.setState({
            [type]: {
                ...this.state[type],
                [counter]: !this.state[type][counter]
            }
        });
    }

    handleChange(event, counter_type, index) {
        let obj = {
            [counter_type]: this.state.config[counter_type]
        };

        if (index === undefined) {
            obj[counter_type][event.target.name] = parseInt(event.target.value) || 0;
        } else {
            obj[counter_type][event.target.name] = [...this.state.config[counter_type][event.target.name]];
            obj[counter_type][event.target.name][index] = event.target.value;
        }

        this.setState({
            config: {
                ...this.state.config,
                ...obj
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.isConfigValid()) {
            DB.setAndUpdateConfigFile(this.state.config);
        }
    }

    render() {
        return (
            <div>
                <label> Hour Counters </label>
                <div>
                    {
                        Object.keys(this.state.config.hour_counters).map((counter, idx) => (
                            [<Button
                                size='sm'
                                outline
                                color='primary'
                                onClick={() => this.handleClick('hour_counters', counter)}>
                                {counter}
                            </Button>,
                                <br/>,
                                this.state.hour_counters[counter] ?
                                    <div>
                                        <InputGroup>
                                            <Input
                                            name={counter}
                                            placeholder={counter + 'start date'}
                                            value={this.state.config.hour_counters[counter][0]}
                                            onChange={event => this.handleChange(event, 'hour_counters', 0)}
                                            />
                                        </InputGroup>
                                        <InputGroup>
                                            <Input
                                            name={counter}
                                            placeholder={counter + 'end date'}
                                            value={this.state.config.hour_counters[counter][1]}
                                            onChange={event => this.handleChange(event, 'hour_counters', 1)}
                                            />
                                        </InputGroup>

                                    </div> : null]
                        ))
                    }
                </div>
                <label> Day Counters </label>
                <div>
                    {
                        Object.keys(this.state.config.day_counters).map((counter, idx) => (
                            [<Button
                                size='sm'
                                outline
                                color='primary'
                                onClick={() => this.handleClick('day_counters', counter)}>
                                {counter}
                            </Button>,
                                <br/>,
                                this.state.day_counters[counter] ?
                                    this.state.config.day_counters[counter].length > 1 ?
                                        <div>
                                            <InputGroup>
                                                <Input
                                                    name={counter}
                                                    placeholder={counter + 'start date'}
                                                    value={this.state.config.day_counters[counter][0]}
                                                    onChange={event => this.handleChange(event, 'day_counters', 0)}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <Input
                                                    name={counter}
                                                    placeholder={counter + 'end date'}
                                                    value={this.state.config.day_counters[counter][1]}
                                                    onChange={event => this.handleChange(event, 'day_counters', 1)}
                                                />
                                            </InputGroup>
                                        </div>
                                        :
                                        <div>
                                            <InputGroup>
                                                <Input
                                                    name={counter}
                                                    placeholder={'Day of ' + counter}
                                                    value={this.state.config.day_counters[counter]}
                                                    onChange={event => this.handleChange(event, 'day_counters')}
                                                />
                                            </InputGroup>
                                            <p>
                                                {
                                                    moment().isoWeekday(this.state.config.day_counters[counter]).format('dddd')
                                                }
                                            </p>
                                        </div> : null]
                        ))
                    }
                </div>
                <br/>
                <Button
                    type='submit'
                    color={this.isConfigValid() ? 'success' : 'danger'}
                    onClick={this.handleSubmit}
                >Save Changes</Button>
            </div>
        )
    }
}