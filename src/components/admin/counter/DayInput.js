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

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default class DayInput extends Component {
    constructor(props) {
        super(props);

        const day = DB.getCounterValue(this.props.counter.type, this.props.counter.name);

        this.state = {
            counter_name: this.props.counter.name,
            counter_day: day,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            counter_name: event.target.value,
        });
    }

    handleClick(event) {
        this.setState({
            counter_day: event.target.name,
        })
    }

    handleSubmit() {
        ConfigStore.updateDayCounter(
            this.props.counter.type,
            this.state.counter_name,
            this.state.counter_day
        );
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
                <ButtonGroup>
                    {
                        DAYS.map((day, idx) =>
                            <Button
                                key={ idx }
                                name={day}
                                outline
                                size='sm'
                                active={ this.state.counter_day === day }
                                onClick={ this.handleClick }
                            >
                                { day }
                            </Button>
                        )
                    }
                </ButtonGroup>
                <br/>
                <Button
                    color="success"
                    onClick={ this.handleSubmit }
                >
                    { 'Save Changes to ' + this.state.counter_name }
                </Button>
            </Fragment>
        )
    }
}