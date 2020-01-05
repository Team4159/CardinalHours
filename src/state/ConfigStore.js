import MicroEmitter from 'micro-emitter';

class ConfigStore {
    constructor() {
        this.event_emitter = new MicroEmitter();
    }

    onRefreshMainContainer(handler) {
        this.event_emitter.on('refreshMainContainer', handler)
    }

    refreshMainContainer() {
        this.event_emitter.emit('refreshMainContainer');
    }
}

let instance = new ConfigStore();

export default instance;