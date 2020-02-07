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

    removeUser(user) {
        const res = DB.removeUser(user);

        if (res) {
            this.event_emitter.emit('removeUser', DB.query(user));

            this.signOutUser(user);
        }

        return res;
    }

    onRemoveUser(handler) {
        this.event_emitter.on('removeUser', handler);
    }

    updateUser(user, name, id, sessions) {
        const res = DB.updateUser(user, name, id, sessions);

        if (res) {
            this.event_emitter.emit('updateUser', DB.query(user));
        }

        return res;
    }

    onUpdateUser(handler) {
        this.event_emitter.on('updateUser');
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
