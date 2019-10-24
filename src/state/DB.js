import fs from 'fs';
import path from 'path';
import os from 'os';
import moment from 'moment';

class DB {
    constructor() {
        this.filename = path.join(os.homedir(), 'users.json');
        this.fsWait = false;

        if (fs.existsSync(this.filename)) {
            this.users = JSON.parse(fs.readFileSync(this.filename));
        } else {
            fs.writeFileSync(this.filename, JSON.stringify([]));
            this.users = [];
        }

        fs.watchFile(this.filename, () => {
            this.users = JSON.parse(fs.readFileSync(this.filename));
        });
    }

    updateFile() {
        fs.writeFileSync(this.filename, JSON.stringify(this.users));
    }

    addUser(user) {
        if (this.query({id: user.id})) return false;

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
        user = this.query(user);
        return (user.imported_hours ? moment.duration(user.imported_hours, 'hours') : 0) + user.sessions.reduce((acc, cur) => acc + moment(cur.end).diff(moment(cur.start)), 0);
    }

    getFridayMeetings(user) {
        user = this.query(user);
        return user.sessions.filter(session => moment(session.start).isoWeekday() === 5).length + user.imported_meetings ? user.imported_meetings : 0;
    }

    query(query) {
        return this.users.find(user => Object.keys(query)
            .every(key => query[key] === user[key])
        );
    }
}

let instance = new DB();

export default instance;
