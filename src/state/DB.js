import fs from 'fs';
import path from 'path';
import os from 'os';

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

        console.log(this.users);

        this.users.push({
            name: user.name,
            id: user.id,
            total_time: 0
        });

        this.updateFile();

        return true;
    }

    addTime(user, time) {
        user = Object.assign({}, user);

        delete user.time_in;

        this.query(user).total_time += time;

        this.updateFile();
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
