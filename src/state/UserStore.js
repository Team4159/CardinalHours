import MicroEmitter from 'micro-emitter';

import DB from './DB';

class UserStore {
    constructor() {
        this.event_emitter = new MicroEmitter();
    }

    addUser(user) {
        const res = DB.addUser(user);

        if (res) {
            this.event_emitter.emit('addUser', DB.query(user));
        }

        return res;
    }

    onAddUser(handler) {
        this.event_emitter.on('addUser', handler);
    }

    signInUser(user) {
        this.event_emitter.emit('signInUser', DB.query(user));
    }

    onSignInUser(handler) {
        this.event_emitter.on('signInUser', handler);
    }

    signOutUser(user, session) {
        this.event_emitter.emit('signOutUser', { user: DB.query(user), session });
    }

    onSignOutUser(handler) {
        this.event_emitter.on('signOutUser', handler);
    }
}

let instance = new UserStore();

export default instance;
