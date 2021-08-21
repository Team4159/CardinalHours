import fs from 'fs';
import path from 'path';

import log from 'electron-log';
import hash from 'password-hash';

import moment from 'moment';
import GoogleSpreadsheet from 'google-spreadsheet';
import { remote } from 'electron';
import UserStore from "./UserStore";

class DB {
    constructor() {
        log.info('Initializing database...');

        this.users_filename = path.join(remote.getGlobal('dataPath'), 'users.json');
        this.config_filename = path.join(remote.getGlobal('dataPath'), 'config.json');

        this.isDev = remote.getGlobal('isDev');

        if (fs.existsSync(this.config_filename)) {
            this.config = JSON.parse(fs.readFileSync(this.config_filename));
        } else {
            this.setAndUpdateConfigFile(require('./default_config.json'));
        }

        if (fs.existsSync(this.users_filename)) {
            this.users = JSON.parse(fs.readFileSync(this.users_filename));
        } else {
            fs.writeFileSync(this.users_filename, JSON.stringify([]));
            this.users = [];
        }

        fs.watchFile(this.users_filename, () => {
            this.users = JSON.parse(fs.readFileSync(this.users_filename));
        });

        this.sheet = new GoogleSpreadsheet(this.config.sheets.sheet_id);
        this.creds = this.config.sheets.creds;
        this.checkAuth(err => {
            if (err) return log.error('Failed to refresh authentication: ' + err);
            if (!this.isDev) {
                this.syncSheets();
            }
        });
    }

    populateRow(user, headers, row) {
        user = this.query(user);
        const formatTime = millis => (millis / 1000 / 60 / 60).toFixed(2);
        const getColumn = header_ => headers.findIndex(header => header.value === header_);

        row[getColumn('Team Hours')].value = formatTime(
            (user.imported_hours ? moment.duration(user.imported_hours, 'hours') : 0) +
            this.getTotalTime(user.sessions)
        );

        for (let day_counter of Object.keys(this.config.day_counters)) {
            let filter = this.config.day_counters[day_counter];
            row[getColumn(day_counter)].value = ((filter === 'Friday' || filter === 5) && user.imported_meetings ? user.imported_meetings : 0) +
                this.getTotalDays(this.filterSessions(user.sessions, filter));
        }

        for (let hour_counter of Object.keys(this.config.hour_counters)) {
            let filter = this.config.hour_counters[hour_counter];
            row[getColumn(hour_counter)].value = formatTime(this.getTotalTime(this.filterSessions(user.sessions, filter)));
        }

        return row;
    }

    checkAuth(cb) {
        log.info('Refreshing authentication...');
        if (!this.sheet.isAuthActive()) {
            this.sheet.useServiceAccountAuth(this.creds, err => {
                if (err) return cb(err);
                this.sheet.getInfo((err, info) => {
                    if (err) return cb(err);
                    const worksheet_name = this.config.sheets.worksheet_name;
                    this.worksheet = info.worksheets.find(worksheet => worksheet.title === worksheet_name);
                    if (!this.worksheet) return cb(new Error('Failed to find worksheet with name ' + worksheet_name));
                    log.info('Found worksheet with name ' + worksheet_name);
                    cb(null);
                });
            });
        } else {
            cb(null);
        }
    }

    getCells(cb) {
        this.checkAuth(err => {
            if (err) cb(err);
            this.worksheet.getCells({
                'return-empty': true
            }, (err, cells) => {
                if (err) return cb(err);

                let rowSize = 0;
                for (let cell of cells) {
                    if (cell.col > rowSize) {
                        rowSize = cell.col;
                    } else {
                        break;
                    }
                }

                let headers = cells.slice(0, rowSize);

                cb(null, [headers, cells]);
            });
        });
    }

    syncSheets() {
        log.info('Syncing Google Sheets...');
        this.getCells((err, [headers, cells]) => {
            if (err) return log.error(err);

           const getColumn = header_ => headers.findIndex(header => header.value === header_);

            for (let i = headers.length; i < cells.length - headers.length; i += headers.length) {
                let row = cells.slice(i, i + headers.length);
                if (row[getColumn('FIRST')].value === '' && row[getColumn('Last')].value === '') {
                    break;
                }
                let name = `${ row[getColumn('FIRST')].value } ${ row[getColumn('Last')].value }`;
                let user = this.query({ name });
                if (!user) {
                    log.error('Unable to find ' + name + ' on Google Sheets');
                    continue;
                }
                cells = cells.slice(0, i).concat(this.populateRow(user, headers, row)).concat(cells.slice(i + headers.length));
            }

            this.worksheet.bulkUpdateCells(cells);
        });
    }

    addUser(user) {
        log.info('Adding user: ' + user.name);
        if (this.query({id: user.id}) || user.id === "" || user.name === "") return false;
        //an existing username probably does something bad, idk I'm just a noob
        //the system freaks out on empty username, so just say no
        //same with passwords

        this.users.push({
            name: user.name,
            id: user.id,
            sessions: []
        });

        this.updateUsersFile();

        return true;
    }

    addSession(user, session) {
        log.info('Adding session for ' + user.name);
        this.query(user).sessions.push(session);

        if (!this.isDev) {
            this.syncSheets();
        }

        this.updateUsersFile();
    }

    removeSession(user, removed_session) {
        log.info('Removing session ' + removed_session.start + ' - ' + removed_session.end + ' for ' + user.name);

        let sessions =  this.query(user).sessions;
        sessions.splice(sessions.findIndex(session => session.end === removed_session.end), 1);

        if (!this.isDev) {
            this.syncSheets();
        }

        this.query(user).sessions = sessions;
        this.updateUsersFile();
    }

    filterSessions(sessions, filter) {
        if (typeof filter === 'string') {
            return sessions.filter(session => moment(session.start).weekday() === moment.weekdays().indexOf(filter));
        } else if (Array.isArray(filter)) {
            return sessions.filter(session => moment(session.start).isBetween(filter[0], filter[1]));
        } else if (typeof filter === 'number') {
            return sessions.filter(session => moment(session.start).isoWeekday() === filter);
        }
    }

    query(query) {
        return this.users.find(user => Object.keys(query)
            .every(key => query[key] === user[key])
        );
    }

    getTotalTime(sessions) {
        return sessions.reduce((acc, cur) => acc + moment(cur.end).diff(moment(cur.start)), 0);
    }

    getTotalDays(sessions) {
        return sessions.filter((session, index) => index === 0 || !moment(session.start).isSame(moment(sessions[index - 1].start), 'day')).length;
    }

    updateUsersFile() {
        log.info('Updating users file...');
        fs.writeFileSync(this.users_filename, JSON.stringify(this.users));
    }

    updateConfigFile() {
        log.info('Updating config file...');
        fs.writeFileSync(this.config_filename, JSON.stringify(this.config));
    }

    setAndUpdateConfigFile(value, key) {
        if (key === undefined) {
            this.config = value;
        } else {
            this.config[key] = value;
        }

        this.updateConfigFile();
    }

    setPassword(password) {
        let hashed_password = password ? hash.generate(password) : null;

        this.setAndUpdateConfigFile(hashed_password, 'hashed_password')
    }

    verifyPassword(password) {
        return hash.verify(password, this.config.hashed_password);
    }

    isPasswordNotSet() {
        return !hash.isHashed(this.config.hashed_password);
    }

    /*
     * returns all 'counter labels'
     *
     * counter label is object consisting of
     * name: name of counter
     * type: type of counter ("hour_counters" OR "day_counters")
     */
    getCounterLabels() {
        let counter_labels = [];

        for (let counter_name of Object.keys(this.config.day_counters)) {
            counter_labels.push({
                name: counter_name,
                type: 'day_counters'
            })
        }

        for (let counter_name of Object.keys(this.config.hour_counters)) {
            counter_labels.push({
                name: counter_name,
                type: 'hour_counters'
            })
        }

        return counter_labels;
    }

    /*
     * set counter of:
     * type TYPE ("hour_counters" OR "day_counters")
     * name NAME
     * start date START or day name START
     * end date END or UNDEFINED if counter is for specific day
     */
    setCounter(type, name, start, end) {
        if (end === undefined) {
            this.config[type][name]= start;
        } else {
            this.config[type][name] = [start, end];
        }

        this.updateConfigFile();
    }

    /*
     * return ARRAY [START, END] or STRING "DAY"
     */
    getCounterValue(type, name) {
        return this.config[type][name];
    }

    /*
     * return TRUE if counter is for range of dates, FALSE if counter is for specific day
     */
    isCounterRange(type, name) {
        return this.config[type][name] instanceof Array;
    }

    /*
     * return TRUE if date_string is valid date
     */
    isDateValid(date_string) {
        return moment(date_string).isValid();
    }

    /*
     * return array of STRING user names
     */
    getUserNames() {
        return this.users.map(user => user.name);
    }

    /*
     * finds user with name ORIGINAL_NAME and sets its
     * NAME to NEW_NAME
     * ID to NEW_ID
     * NAME to NEW_SESSIONS
     */
    setUser(original_name, new_name, new_id, new_sessions) {
        const idx = this.users.findIndex(user => user.name === original_name);

        this.users[idx].name = new_name;
        this.users[idx].id = new_id;
        this.users[idx].sessions = new_sessions;
    }


    /*
     * finds and drops user with name NAME
     */
    dropUser(name) {
        const drop = this.query({name: name});

        UserStore.signOutUser(drop);

        this.users = this.users.filter(user => user.name !== drop.name);
        this.updateUsersFile();
    }
}

let instance = new DB();

export default instance;
