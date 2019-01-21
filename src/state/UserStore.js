import MicroEmitter from 'micro-emitter';

export default class SchoolStore {
    constructor() {
        this.eventEmitter = new MicroEmitter();
    }

    addUser(user) {
        this.eventEmitter.emit('addUser', user);
    }

    onAddUser(handler) {
        this.eventEmitter.on('addUser', handler);
    }

    signInUser(user) {
        this.eventEmitter.emit('signInUser', user);
    }

    onSignInUser(handler) {
        this.eventEmitter.on('signInUser', handler);
    }

    signOutUser(user) {
        this.eventEmitter.emit('signOutUser', user);
    }

    onSignOutUser(handler) {
        this.eventEmitter.on('signOutUser', handler);
    }
}
