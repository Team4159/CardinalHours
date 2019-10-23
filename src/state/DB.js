import fs from 'fs';
import path from 'path';
import os from 'os';
import moment from 'moment';
import GoogleSpreadsheet from 'google-spreadsheet';

class DB {
    constructor() {
        this.filename = path.join(os.homedir(), 'users.json');
        this.fsWait = false;

        // https://docs.google.com/spreadsheets/d/1N06gqxOtbdiD12g7-4PyYCE0RdWl6vOx2J1CkGexR3A/edit?usp=sharing
        this.sheet = new GoogleSpreadsheet('1N06gqxOtbdiD12g7-4PyYCE0RdWl6vOx2J1CkGexR3A');
        this.creds = require('./client_secret');

        if (fs.existsSync(this.filename)) {
            this.users = JSON.parse(fs.readFileSync(this.filename));
        } else {
            fs.writeFileSync(this.filename, JSON.stringify([]));
            this.users = [];
        }

        fs.watch(this.filename, (event, filename) => {
            if (filename) {
                if (this.fsWait) return;
                this.fsWait = setTimeout(() => {
                    this.fsWait = false;
                }, 100);
                this.users = JSON.parse(fs.readFileSync(this.filename));
            }
        });
    }

    updateFile() {
        this.fsWait = true;
        this.fsWait = setTimeout(() => {
            this.fsWait = false;
        }, 100);

        fs.writeFileSync(this.filename, JSON.stringify(this.users));
    }

    updateSheets() {
        this.sheet.useServiceAccountAuth(this.creds, err => {
            this.sheet.getRows(1, (err, rows) => {
                for (let row of rows) {
                    row.del();
                }
            });

            for (const user of this.users) {
                this.sheet.addRow(1, {Name: user["name"], Hours: Math.floor(this.getTotalTime(user) / 3600000)})
            }
        });
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

        this.updateSheets();
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
