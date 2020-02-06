import React, {Component, Fragment} from 'react';
import {
    Button,
    ButtonGroup,
} from 'reactstrap';

import DB from '../../../state/DB';
import ConfigStore from '../../../state/ConfigStore';

import RangeInput from "./RangeInput";
import DayInput from "./DayInput";

export default class CounterConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            counter_labels: DB.getCounterLabels(),
            selected_counter: null,
        };

        this.setSelectedCounter = this.setSelectedCounter.bind(this);

        ConfigStore.onRefreshCounterConfigRadio(_ => {
            this.forceUpdate();
        })
    }

    setSelectedCounter(counter_label) {
        this.setState({
            selected_counter: counter_label,
        })
    }

    render() {
        return (
            <Fragment>
                <ButtonGroup>
                    {
                        this.state.counter_labels.map((counter_label, idx) =>
                            <Button
                                key={ idx }
                                outline
                                color="primary"
                                active={ this.state.selected_counter === counter_label.name }
                                onClick={ _ => this.setSelectedCounter(counter_label) }
                            >
                                {counter_label.name}
                            </Button>
                        )
                    }
                </ButtonGroup>
                <br/>
                {
                    this.state.selected_counter ?
                        DB.isCounterRange(this.state.selected_counter.type, this.state.selected_counter.name) ?
                            <RangeInput key={ this.state.counter_labels.findIndex(counter_label => counter_label === this.state.selected_counter) }
                                        counter={ this.state.selected_counter }/> :
                            <DayInput key={ this.state.counter_labels.findIndex(counter_label => counter_label === this.state.selected_counter) }
                                      counter={this.state.selected_counter }/>
                        : null
                }
            </Fragment>
        )
    }
}