import React, { Component } from 'react';
import { Table } from 'reactstrap';

import moment from 'moment';

import UserStore from '../state/UserStore';
import DB from '../state/DB';

export default class TimeTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sessions: [],
            current_time: moment(),
            hidden_id: ''
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(event) {
        if (event.which === 13) {
            const match = DB.query({
                id: this.state.hidden_id
            });

            if (match) {
                const index = this.state.sessions.findIndex(session => session.user.id === match.id);

                if (index === -1) {
                    UserStore.signInUser(match);
                } else {
                    const session = this.state.sessions[index];
                    session.session.end = moment().toISOString();
                    const duration = moment(session.session.end).diff(session.session.start);
                    if (duration > moment.duration(5, 'seconds') && duration < moment.duration(12, 'hours')) {
                        DB.addSession(session.user, session.session);
                    }
                    UserStore.signOutUser(session.user, session.session);
                }
            }

            this.setState({
                hidden_id: ''
            });
        } else {
            this.setState({
                hidden_id: this.state.hidden_id + String.fromCharCode(event.which)
            });
        }
    }

    componentDidMount() {
        document.addEventListener('keypress', this.handleKeyPress, false);

        setInterval(this.tick.bind(this), 1000);

        UserStore.onAddUser(() => this.setState({
            hidden_id: ''
        }));

        UserStore.onSignInUser(user => this.setState({
            sessions: this.state.sessions.concat([{
                user: {
                    name: user.name,
                    id: user.id
                },
                session: {
                    start: moment().toISOString()
                }
            }])
        }));

        UserStore.onSignOutUser(({ user }) => {
            const index = this.state.sessions.findIndex(session => session.user.id === user.id);

            const newSessions = this.state.sessions.slice();

            newSessions.splice(index, 1);

            this.setState({
                sessions: newSessions
            });
        });
    }

    static formatTime(time) {
        time = time / 1000;

        const hours = Math.floor(time / (60 * 60));
        time -= hours * (60 * 60);

        const minutes = Math.floor(time / 60);
        time -= minutes * 60;

        const seconds = Math.round(time);

        const pad = number => number.toString().length === 1 ? '0' + number : number;

        return `${ pad(hours)  }:${ pad(minutes) }:${ pad(seconds) }`;
    }

    tick() {
        this.setState({
            current_time: moment()
        });
    }

    render() {
        return (
            <Table className='TimeTable'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Time In</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.sessions.map((session, idx) => (
                            <tr key={ idx }>
                                <td>{ session.user.name }</td>
                                <td>{ TimeTable.formatTime(this.state.current_time.diff(moment(session.session.start)) > 0 ?
                                                                 this.state.current_time.diff(moment(session.session.start)) : 0) }</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        );
    }
}
