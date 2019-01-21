import React, { Component } from 'react';
import { Table } from 'reactstrap';

export default class TimeTable extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        setInterval(this.tick.bind(this), 1000);
    }

    tick() {
        this.setState({
            members: this.props.members.map(user =>
                user.signed_in ? Object.assign(user, {
                time_in: user.time_in + 1
            }): null)
        })
    }

    static formatTime(seconds) {
        const date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8);
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
                        this.props.members.map((user, idx) => (
                            user.signed_in ? <tr key={ idx }>
                                <td>{ user.name }</td>
                                <td>{ TimeTable.formatTime(user.time_in) }</td>
                            </tr> : null
                        ))
                    }
                </tbody>
            </Table>
        );
    }
}