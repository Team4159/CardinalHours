import fs from 'fs';
import path from 'path';
import os from 'os';
import moment from 'moment';
import GoogleSpreadsheet from 'google-spreadsheet';

import config from '../state/config.json';

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

    updateSheets(user) {
        this.sheet.useServiceAccountAuth(this.creds, () => {
            this.sheet.getRows(1, (err, rows) => {
                if (err) return console.error(err);

                const formatTime = millis => (millis / 1000 / 60 / 60).toFixed(2);

                let row = rows.find(row => row.name === user.name);

                row.hours = formatTime(this.getTotalUserTime(user));
                row.teamdays = this.getTotalUserDays(user);

                for (let day_counter of Object.keys(config.day_counters)) {
                    row[day_counter] = this.getTotalCertainDays(user, config.day_counters[day_counter]);
                }

                for (let hour_counter of Object.keys(config.hour_counters)) {
                    row[hour_counter] = formatTime(this.getTotalTimeInRange(user, config.hour_counters[hour_counter]));
                }

                row.save(err => err ? console.error(err) : null);
            })
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

        this.updateSheets(user);
        this.updateFile();
    }

    query(query) {
        return this.users.find(user => Object.keys(query)
            .every(key => query[key] === user[key])
        );
    }

    getTotalTime(sessions) {
        return sessions.reduce((acc, cur) => acc + moment(cur.end).diff(moment(cur.start)), 0);
    }

    getTotalUserTime(user) {
        user = this.query(user);
        return (user.imported_hours ? moment.duration(user.imported_hours, 'hours') : 0) + this.getTotalTime(user.sessions);
    }

    getTotalTimeInRange(user, start, end) {
        user = this.query(user);
        start = moment(start);
        end = moment(end);
        return this.getTotalTime(user.sessions.filter(session => moment(session.start).isBetween(start, end)));
    }

    getTotalDays(sessions) {
        return sessions.filter((session, index) => index === 0 || !moment(session.start).isSame(moment(sessions[index - 1]), 'day')).length;
    }

    getTotalUserDays(user) {
        user = this.query(user);
        return this.getTotalDays(user.sessions);
    }

    getTotalCertainDays(user, day) {
        user = this.query(user);
        return (day === 5 && user.imported_meetings ? user.imported_meetings : 0) + this.getTotalDays(user.sessions.filter(session => moment(session.start).isoWeekday === day));
    }
}

let instance = new DB();

export default instance;
