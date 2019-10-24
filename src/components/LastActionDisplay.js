import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';

import moment from 'moment';

import TimeTable from './TimeTable';
import UserStore from '../state/UserStore';
import DB from '../state/DB';

let config = require("../state/config.json");


export default class LastActionDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            action: '',
            session_time: 0,
            total_time: 0,
            total_days: 0,
            additional_fields: {}
        };
    }

    componentDidMount() {
        UserStore.onSignInUser(user => this.setState({
            name: user.name,
            action: 'IN',
            session_time: 'N/A',
            total_time: DB.getTotalUserTime(user),
            additional_fields: this.populateAdditionalFields(user)
        }));

        UserStore.onSignOutUser(({ user, session }) => this.setState({
            name: user.name,
            action: 'OUT',
            session_time: moment(session.end).diff(session.start),
            total_time: DB.getTotalUserTime(user),
            additional_fields: this.populateAdditionalFields(user)
        }));
    }

    populateAdditionalFields(user) {
        let additional_fields = {};

        for (let day_counter of Object.keys(config.day_counters)) {
            additional_fields[day_counter] = DB.getTotalCertainDays(user, config.day_counters[day_counter]);
        }

        for (let hour_counter of Object.keys(config.hour_counters)) {
            additional_fields[hour_counter] = TimeTable.formatTime(DB.getTotalTimeInRange(user, config.hour_counters[hour_counter]));
        }

        console.log(additional_fields);
        return additional_fields;
    }

    render() {
        return (
            <Jumbotron className='LastActionDisplay'>
                <h1 className='display-3'>{ this.state.name }</h1>
                <h1 className='display-3' style={ { color: this.state.action === 'IN' ? 'green' : 'red' } }>{ this.state.action }</h1>
                <hr className='my-2'/>
                <p className='lead'>
                    Session Time: { typeof this.state.session_time === 'number' ? TimeTable.formatTime(this.state.session_time) : this.state.session_time }
                    <br/>
                    Total Time: { TimeTable.formatTime(this.state.total_time) }
                    <br/>
                    {
                        Object.keys(this.state.additional_fields).map((key) => (
                            key + ": " + this.state.additional_fields[key]
                        ))
                    }
                </p>
            </Jumbotron>
        );
    }

}
