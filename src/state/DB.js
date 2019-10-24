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
        // writer@quickstart-1553556916205.iam.gserviceaccount.com
        this.sheet = new GoogleSpreadsheet('1N06gqxOtbdiD12g7-4PyYCE0RdWl6vOx2J1CkGexR3A');
        this.creds = require('./client_secret');

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

    updateSheets() {
        this.sheet.useServiceAccountAuth(this.creds, err => {
            this.sheet.getRows(1, (err, rows) => {
                for (let row of rows) {
                    let user = this.query({name: row.name});
                    if (user !== undefined) {
                        row.hours = (this.getTotalTime(user) / 3600000).toFixed(2);
                        row.save(console.error);
                    }
                }
            });
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
        user = this.query(user);
        return (user.imported_hours ? moment.duration(user.imported_hours, 'hours') : 0) + user.sessions.reduce((acc, cur) => acc + moment(cur.end).diff(moment(cur.start)), 0);
    }

    getFridayMeetings(user) {
        user = this.query(user);
        return (user.imported_meetings ? user.imported_meetings : 0) + user.sessions.filter(session => moment(session.start).isoWeekday() === 5).length;
    }

    query(query) {
        return this.users.find(user => Object.keys(query)
            .every(key => query[key] === user[key])
        );
    }
}

let instance = new DB();

export default instance;
