import React, {Component} from 'react';
import DB from "../../state/DB";
import moment from "moment";
import {Badge, Button, Input} from "reactstrap";

export default class MiscConfig extends Component {
    constructor(props) {
        super(props);

        this.toggleSignUps = this.toggleSignUps.bind(this);
    }

    toggleSignUps() {
        //TODO: Update UserDisplay.js

        DB.writeToFile({...DB.config, ...{"sign_ups": !DB.config.sign_ups}});
        this.forceUpdate();
    }

    render() {
        return (
            <div>
                <Button
                    outline
                    className="offButton"
                    onClick={this.toggleSignUps}
                    color={DB.config.sign_ups ? "primary" : "secondary"}
                >Sign Ups {DB.config.sign_ups ?
                    <Badge color="success" pill>Enabled</Badge>
                    :<Badge color="dark" pill>Disabled</Badge>}
                </Button>
            </div>
        );
    }
}