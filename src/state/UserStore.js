import MicroEmitter from 'micro-emitter';

import MockDB from './DB';

class UserStore {
    constructor() {
        this.eventEmitter = new MicroEmitter();
        this.DB = MockDB.getInstance();
    }

    addUser(user) {
        const res = this.DB.addUser(user);

        if (res) {
            this.eventEmitter.emit('addUser', this.DB.query(user));
        }

        return res;
    }

    onAddUser(handler) {
        this.eventEmitter.on('addUser', handler);
    }

    signInUser(user) {
        this.eventEmitter.emit('signInUser', this.DB.query(user));
    }

    onSignInUser(handler) {
        this.eventEmitter.on('signInUser', handler);
    }

    signOutUser(user) {
        this.eventEmitter.emit('signOutUser', this.DB.query(user));
    }

    onSignOutUser(handler) {
        this.eventEmitter.on('signOutUser', handler);
    }
}

let instance;

export default {
    getInstance() {
        if (instance === undefined) instance = new UserStore();
        return instance;
    }
}
