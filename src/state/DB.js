import fs from 'fs';
import path from 'path';

import moment from 'moment';
import GoogleSpreadsheet from 'google-spreadsheet';
import { remote } from 'electron';

class DB {
    constructor() {
        this.filename = path.join(remote.getGlobal('dataPath'), 'users.json');
        this.fsWait = false;

        this.isDev = remote.getGlobal('isDev');

        this.config_filename = path.join(remote.getGlobal('dataPath'), 'config.json');
        if (fs.existsSync(this.config_filename)) {
            this.config = JSON.parse(fs.readFileSync(this.config_filename));
        } else {
            fs.writeFileSync(this.config_filename, JSON.stringify(require('./default_config.json')));
            this.config = require('./default_config.json');
        }

        if (fs.existsSync(this.filename)) {
            this.users = JSON.parse(fs.readFileSync(this.filename));
        } else {
            fs.writeFileSync(this.filename, JSON.stringify([]));
            this.users = [];
        }

        fs.watchFile(this.filename, () => {
            this.users = JSON.parse(fs.readFileSync(this.filename));
        });

        this.sheet = new GoogleSpreadsheet(this.config.sheets.sheet_id);
        this.creds = require('./client_secret');

        if (!this.isDev) {
            this.hardSyncSheets();
        }
    }

    updateFile() {
        fs.writeFileSync(this.filename, JSON.stringify(this.users));
    }

    populateRow(user, row) {
        const formatTime = millis => (millis / 1000 / 60 / 60).toFixed(2);

        row['Total Team Hours'] = formatTime(this.getTotalUserTime(user));

        for (let day_counter of Object.keys(this.config.day_counters)) {
            row[day_counter] = this.getTotalCertainDays(user, this.config.day_counters[day_counter]);
        }

        for (let hour_counter of Object.keys(this.config.hour_counters)) {
            row[hour_counter] = formatTime(this.getTotalTimeInRange(user, ...this.config.hour_counters[hour_counter]));
        }

        row.save(err => {
            if (err) {
                setTimeout(() => this.populateRow(user, row), 1000);
            }
        });
    }

    hardSyncSheets() {
        this.sheet.useServiceAccountAuth(this.creds, err => {
            if (err) return console.error(err);
            this.sheet.getRows(this.config.sheets.worksheet_id, (err, rows) => {
                if (err) return console.error(err);

                for (let row of rows) {
                    if (row.first === "" && row.last === "") break;
                    this.populateRow(this.query({ name: `${ row.first } ${ row.last }` }), row);
                }
            });
        });
    }

    updateSheets(user) {
        this.sheet.useServiceAccountAuth(this.creds, err => {
            if (err) return console.error(err);
            this.sheet.getRows(this.config.sheets.worksheet_id, (err, rows) => {
                if (err) return console.error(err);

                let row = rows.find(row =>  `${ row.first } ${ row.last }` === user.name);
                this.populateRow(user, row);
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

        if (!this.isDev) {
            this.updateSheets(user);
        }
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
        return (day === 5 && user.imported_meetings ? user.imported_meetings : 0) + this.getTotalDays(user.sessions.filter(session => moment(session.start).isoWeekday() === day));
    }
}

let instance = new DB();

export default instance;
