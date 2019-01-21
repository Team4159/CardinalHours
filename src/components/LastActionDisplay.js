import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';

export default class LastActionDisplay extends Component {
    constructor(props) {
        super(props);

        this.UserStore = this.props.UserStore;
        this.DB = this.props.DB;

        this.state = {
            name: '',
            action: '',
            session_time: '',
            total_time: '',
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
                <p className='lead'>{ this.state.name } - { this.state.action }</p>
                <hr className='my-2' />
                <p>
                    Session Time: { this.state.session_time }
                    <br/>
                    Total time: { this.state.total_time }
                </p>
            </Jumbotron>
        );
    }
}
