import React, { Component } from 'react';
import { Table } from 'reactstrap';

export default class TimeTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signed_in: Array(100).fill(undefined).map(_ => Object.assign({}, {
                name: 'Robotics Member',
                time_in: 0
            }))
        };
    }

    componentDidMount() {
        setInterval(this.tick.bind(this), 1000);
    }

    tick() {
        this.setState({
            signed_in: this.state.signed_in.map(user => Object.assign(user, {
                time_in: user.time_in + 1
            }))
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
                        this.state.signed_in.map((user, idx) => (
                            <tr key={ idx }>
                                <td>{ user.name }</td>
                                <td>{ TimeTable.formatTime(user.time_in) }</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        );
    }
}