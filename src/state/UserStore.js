import MicroEmitter from 'micro-emitter';

import DB from './DB';

class UserStore {
    constructor() {
        this.eventEmitter = new MicroEmitter();
    }

    addUser(user) {
        const res = DB.addUser(user);

        if (res) {
            this.eventEmitter.emit('addUser', DB.query(user));
        }

        return res;
    }

    onAddUser(handler) {
        this.eventEmitter.on('addUser', handler);
    }

    signInUser(user) {
        this.eventEmitter.emit('signInUser', DB.query(user));
    }

    onSignInUser(handler) {
        this.eventEmitter.on('signInUser', handler);
    }

    signOutUser(user) {
        this.eventEmitter.emit('signOutUser', DB.query(user));
    }

    onSignOutUser(handler) {
        this.eventEmitter.on('signOutUser', handler);
    }
}

let instance = new UserStore();

export default instance;
