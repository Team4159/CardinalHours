import React, { Component } from 'react';
import {
    Button,
    ButtonGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText
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

        this.resetKeyCounter();

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

    componentWillUpdate() {
        this.resetKeyCounter();
    }

    isConfigValid() {
        return Object.values({...this.state.config.hour_counters, ...this.state.config.day_counters}).every(
            counter => counter.constructor === Array ? counter.every(date => moment(date).isValid()) : typeof counter === 'string' || typeof counter === 'number');
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
        let updated_counter = {
            ...this.state.config[counter_type],
            [event.target.name]: index === undefined ?
                event.target.value :
                Object.assign([], this.state.config[counter_type][event.target.name], {[index]: event.target.value})
        };

        this.setState({
            config: {
                ...this.state.config,
                [counter_type]: updated_counter
            }
        });
    }

    handleSubmit(event) {
        if (this.isConfigValid()) {
            DB.setAndUpdateConfigFile(this.state.config);
        }
    }

    resetKeyCounter() {
        this.key = 0;
    }

    getKey() {
        this.key++;
        return this.key;
    }

    render() {
        return (
            <div>
                <label> Hour Counters </label>
                <div>
                    {
                        Object.keys(this.state.config.hour_counters).map((counter, idx) => (
                            [<Button
                                key={this.getKey()}
                                size='sm'
                                outline
                                color='primary'
                                onClick={() => this.handleClick('hour_counters', counter)}>
                                {counter}
                            </Button>,
                                <br
                                    key={this.getKey()}
                                />,
                                this.state.hour_counters[counter] ?
                                    <div
                                        key={this.getKey()}
                                    >
                                        <InputGroup>
                                            <InputGroupAddon addonType='prepend'>
                                                <InputGroupText>Start Date</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                            name={counter}
                                            placeholder={counter + ' start date'}
                                            value={this.state.config.hour_counters[counter][0]}
                                            onChange={event => this.handleChange(event, 'hour_counters', 0)}
                                            />
                                        </InputGroup>
                                        <InputGroup>
                                            <InputGroupAddon addonType='prepend'>
                                                <InputGroupText>End Date</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                            name={counter}
                                            placeholder={counter + ' end date'}
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
                                key={this.getKey()}
                                size='sm'
                                outline
                                color='primary'
                                onClick={() => this.handleClick('day_counters', counter)}>
                                {counter}
                            </Button>,
                                <br
                                    key={this.getKey()}
                                />,
                                this.state.day_counters[counter] ?
                                    this.state.config.day_counters[counter] instanceof Array ?
                                        <div
                                            key={this.getKey()}
                                        >
                                            <InputGroup>
                                                <InputGroupAddon addonType='prepend'>
                                                    <InputGroupText>Start Date</InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    name={counter}
                                                    placeholder={counter + ' start date'}
                                                    value={this.state.config.day_counters[counter][0]}
                                                    onChange={event => this.handleChange(event, 'day_counters', 0)}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputGroupAddon addonType='prepend'>
                                                    <InputGroupText>End Date</InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    name={counter}
                                                    placeholder={counter + ' end date'}
                                                    value={this.state.config.day_counters[counter][1]}
                                                    onChange={event => this.handleChange(event, 'day_counters', 1)}
                                                />
                                            </InputGroup>
                                        </div> :
                                        <div
                                            key={this.getKey()}
                                        >
                                           <ButtonGroup>
                                               {
                                                   Array(7).fill().map((_, idx) =>
                                                     <Button
                                                         outline
                                                         size='sm'
                                                         key={this.getKey()}
                                                         value={moment().isoWeekday(idx).format('dddd')}
                                                         name={counter}
                                                         color={moment().isoWeekday(this.state.config.day_counters[counter]).format('dddd') ===
                                                                moment().isoWeekday(idx).format('dddd') ? 'primary' : 'secondary'}
                                                         onClick={event => this.handleChange(event, 'day_counters')}
                                                     >
                                                         {
                                                             moment().isoWeekday(idx).format('dddd')
                                                         }
                                                     </Button>
                                                   )
                                               }
                                           </ButtonGroup>
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