import MicroEmitter from 'micro-emitter';

import MockDB from './MockDB';

export default class SchoolStore {
    constructor() {
        this.eventEmitter = new MicroEmitter();
        this.DB = new MockDB();
    }

    addUser(user) {
        user = Object.assign({}, user);

        const res = this.DB.addUser(user);

        if (res) {
            this.eventEmitter.emit('addUser', user);
        }

        return res;
    }

    onAddUser(handler) {
        this.eventEmitter.on('addUser', handler);
    }

    signInUser(user) {
        user = Object.assign({}, user);

        this.eventEmitter.emit('signInUser', user);
    }

    onSignInUser(handler) {
        this.eventEmitter.on('signInUser', handler);
    }

    signOutUser(user) {
        user = Object.assign({}, user);

        this.DB.addTime(user, user.time_in);

        this.eventEmitter.emit('signOutUser', user);
    }

    onSignOutUser(handler) {
        this.eventEmitter.on('signOutUser', handler);
    }
}
