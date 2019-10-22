import React, { Component } from 'react';
import { Table } from 'reactstrap';

import moment from 'moment';

import UserStore from '../state/UserStore';
import DB from '../state/DB';

export default class TimeTable extends Component {
    constructor(props) {
        super(props);

        this.UserStore = UserStore.getInstance();
        this.DB = DB.getInstance();

        this.state = {
            sessions: [],
            current_time: moment(),
            hidden_id: ''
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(event) {
        if (event.which === 13) {
            const match = this.DB.query({
                id: this.state.hidden_id
            });

            if (match) {
                const index = this.state.sessions.findIndex(session => session.user.id === match.id);

                if (index === -1) {
                    this.UserStore.signInUser(match);
                } else {
                    const session = this.state.sessions[index];
                    session.session.end = moment().toISOString();
                    this.DB.addSession(session.user, session.session);
                    this.UserStore.signOutUser(session.user);
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

        this.UserStore.onAddUser(() => this.setState({
            hidden_id: ''
        }));

        this.UserStore.onSignInUser(user => this.setState({
            sessions: this.state.sessions.concat([{
                user,
                session: {
                    start: moment().toISOString()
                }
            }])
        }));

        this.UserStore.onSignOutUser(user => {
            const index = this.state.sessions.findIndex(session => session.user.id === user.id);

            const newUsers = this.state.sessions.slice();

            newUsers.splice(index, 1);

            this.setState({
                sessions: newUsers
            });
        });
    }

    static formatTime(time) {
        return moment.utc(time).format('HH:mm:ss');
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
                                <td>{ TimeTable.formatTime(this.state.current_time.diff(moment(session.session.start))) }</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        );
    }
}
