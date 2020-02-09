import MicroEmitter from 'micro-emitter';
import DB from "./DB";

class ConfigStore {
    constructor() {
        this.event_emitter = new MicroEmitter();
    }

    updateDayCounter(type, name, day) {
        DB.setCounter(
            type,
            name,
            day
        );

        this.event_emitter.emit('updateCounter', type, name);
    }

    updateRangeCounter(type, name, start, end) {
        DB.setCounter(
            type,
            name,
            start,
            day
        );

        this.event_emitter.emit('updateCounter');
    }

    onUpdateCounter(handler) {
        this.event_emitter.on('updateCounter', handler);
    }

    toggleSignUps() {
        DB.toggleSignUps();

        this.event_emitter.emit('toggleSignUps', DB.isSignUpsEnabled());
    }

    onToggleSignUps(handler) {
        this.event_emitter.on('toggleSignUps', handler);
    }

    updatePassword(password) {
        DB.setPassword(password);

        this.event_emitter.emit('updatePassword');
    }

    onUpdatePassword(handler) {
        this.event_emitter.on('updatePassword', handler);
    }
}

let instance = new ConfigStore();

export default instance;