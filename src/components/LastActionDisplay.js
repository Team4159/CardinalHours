import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';

import moment from 'moment';

import TimeTable from './TimeTable';
import UserStore from '../state/UserStore';
import DB from '../state/DB';

import config from '../state/config.json';

export default class LastActionDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            action: '',
            session_time: 0,
            total_time: 0,
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
        return Object.assign(
            Object.keys(config.day_counters).reduce((acc, cur) => {
                acc[cur] = DB.getTotalCertainDays(user, config.day_counters[cur]);
                return acc;
            }, {}),
            Object.keys(config.hour_counters).reduce((acc, cur) => {
                acc[cur] = TimeTable.formatTime(DB.getTotalTimeInRange(user, ...config.hour_counters[cur]));
                return acc;
            }, {})
        );
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
                    {
                        Object.keys(this.state.additional_fields).map((key, idx) => (
                            [<br key={ idx }/>, key + ": " + this.state.additional_fields[key]]
                        ))
                    }
                </p>
            </Jumbotron>
        );
    }

}
