import React, { Component, Fragment } from 'react';
import {
    Button,
    ButtonGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';

import DB from '../../../state/DB';
import ConfigStore from '../../../state/ConfigStore';

export default class RangeInput extends Component {
    constructor(props) {
        super(props);

        const range = DB.getCounterValue(this.props.counter.type, this.props.counter.name);

        this.state = {
            counter_name: this.props.counter.name,
            counter_start: range[0],
            counter_end: range[1],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleSubmit() {
        if (this.isDatesValid()) {
            DB.setCounter(
                this.props.counter.type,
                this.state.counter_name,
                this.state.counter_start,
                this.state.counter_end,
            );

            ConfigStore.refreshCounterConfigRadio();
        }
    }

    isDatesValid() {
        return DB.isDateValid(this.state.counter_start) && DB.isDateValid(this.state.counter_end);
    }

    render() {
        return(
            <Fragment>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>Counter Name</InputGroupText>
                    </InputGroupAddon>
                    <Input
                        name='counter_name'
                        value={ this.state.counter_name }
                        onChange={ this.handleChange }
                    />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>Start Date</InputGroupText>
                    </InputGroupAddon>
                    <Input
                        name='counter_start'
                        value={ this.state.counter_start }
                        onChange={ this.handleChange }
                    />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>End Date</InputGroupText>
                    </InputGroupAddon>
                    <Input
                        name='counter_end'
                        value={ this.state.counter_end }
                        onChange={ this.handleChange }
                    />
                </InputGroup>
                <Button
                    color={ this.isDatesValid() ? "success" : "secondary" }
                    disabled={ !this.isDatesValid() }
                    onClick={ this.handleSubmit }
                >
                    { 'Save Changes to ' + this.state.counter_name }
                </Button>
            </Fragment>
        )
    }
}