import MicroEmitter from 'micro-emitter';

class EmitterHandler {
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

let instance = new EmitterHandler();

export default instance;