import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';

import TimeTable from './TimeTable';

import UserStore from '../state/UserStore';
import DB from '../state/DB';

export default class LastActionDisplay extends Component {
    constructor(props) {
        super(props);

        this.UserStore = UserStore.getInstance();
        this.DB = DB.getInstance();

        this.state = {
            name: '',
            action: '',
            session_time: 0,
            total_time: 0,
        };
    }

    componentDidMount() {
        this.UserStore.onSignInUser(user => this.setState({
            name: user.name,
            action: 'IN',
            session_time: 'N/A',
            total_time: this.DB.query({
                name: user.name,
                id: user.id
            }).total_time
        }));

        this.UserStore.onSignOutUser(user => this.setState({
            name: user.name,
            action: 'OUT',
            session_time: user.time_in,
            total_time: this.DB.query({
                name: user.name,
                id: user.id
            }).total_time
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
                    Total time: { TimeTable.formatTime(this.state.total_time) }
                </p>
            </Jumbotron>
        );
    }
}
