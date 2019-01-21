import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';

export default class LastActionDisplay extends Component {
    render() {
        return (
            <Jumbotron className='LastActionDisplay'>
                <p className='lead'>Brandon Lou</p>
                <hr className='my-2' />
                <p>.</p>
            </Jumbotron>
        );
    }
}
