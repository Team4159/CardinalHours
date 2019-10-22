import fs from 'fs';
import path from 'path';
import os from 'os';
import moment from 'moment';

class DB {
    constructor() {
        this.filename = path.join(os.homedir(), 'users.json');

        if (fs.existsSync(this.filename)) {
            this.users = JSON.parse(fs.readFileSync(this.filename));
        } else {
            fs.writeFileSync(this.filename, JSON.stringify([]));
            this.users = [];
        }
    }

    updateFile() {
        fs.writeFileSync(this.filename, JSON.stringify(this.users));
    }

    addUser(user) {
        if (this.query(user)) return false;

        this.users.push({
            name: user.name,
            id: user.id,
            sessions: []
        });

        this.updateFile();

        return true;
    }

    addSession(user, session) {
        this.query(user).sessions.push(session);
        this.updateFile();
    }

    getTotalTime(user) {
        return this.query(user).sessions.reduce((acc, cur) => acc + moment(cur.end).diff(moment(cur.start)), 0);
    }

    query(query) {
        return this.users.find(user => Object.keys(query)
            .every(key => query[key] === user[key])
        );
    }
}

let instance;

export default {
    getInstance() {
        if (instance === undefined) instance = new DB();
        return instance;
    }
}
