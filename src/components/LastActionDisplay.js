import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';

import moment from 'moment';

import TimeTable from './TimeTable';
import UserStore from '../state/UserStore';
import DB from '../state/DB';

export default class LastActionDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            action: '',
            session_time: 0,
            total_time: 0,
            friday_meetings: 0
        };
    }

    componentDidMount() {
        UserStore.onSignInUser(user => this.setState({
            name: user.name,
            action: 'IN',
            session_time: 'N/A',
            total_time: DB.getTotalTime(user),
            friday_meetings: DB.getFridayMeetings(user)
        }));

        UserStore.onSignOutUser(({ user, session }) => this.setState({
            name: user.name,
            action: 'OUT',
            session_time: moment(session.end).diff(session.start),
            total_time: DB.getTotalTime(user),
            friday_meetings: DB.getFridayMeetings(user)
        }));
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
                    Friday Meetings: { this.state.friday_meetings }
                </p>
            </Jumbotron>
        );
    }
}
