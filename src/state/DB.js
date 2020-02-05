import fs from 'fs';
import path from 'path';

import moment from 'moment';
import GoogleSpreadsheet from 'google-spreadsheet';
import log from 'electron-log';
import { remote } from 'electron';

class DB {
    constructor() {
        log.info('Initializing database...');

        this.filename = path.join(remote.getGlobal('dataPath'), 'users.json');
        this.fsWait = false;

        this.isDev = remote.getGlobal('isDev');

        this.config_filename = path.join(remote.getGlobal('dataPath'), 'config.json');
        this.config = JSON.parse(fs.readFileSync(this.config_filename));

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
        this.creds = this.config.sheets.creds;
        this.checkAuth(err => {
            if (err) return log.error('Failed to refresh authentication: ' + err);
            if (!this.isDev) {
                this.syncSheets();
            }
        });
    }

    updateFile() {
        log.info('Updating users file...');
        fs.writeFileSync(this.filename, JSON.stringify(this.users));
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
            row[getColumn(day_counter)].value = (filter === 'Friday' && user.imported_meetings ? user.imported_meetings : 0) +
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
                if (err) cb(err);
                this.sheet.getInfo((err, info) => {
                    if (err) cb(err);
                    this.worksheet = getMainSheet(info);
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
                if (err) cb(err);

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
            if (err) return console.error(err);

           const getColumn = header_ => headers.findIndex(header => header.value === header_);

            for (let i = headers.length; i < cells.length - headers.length; i += headers.length) {
                let row = cells.slice(i, i + headers.length);
                if (row[getColumn('First')].value === '' && row[getColumn('Last')].value === '') {
                    break;
                }
                let user = this.query({name: `${ row[getColumn('First')].value } ${ row[getColumn('Last')].value }`});
                cells = cells.slice(0, i).concat(this.populateRow(user, headers, row)).concat(cells.slice(i + headers.length));
            }

            this.worksheet.bulkUpdateCells(cells);
        });
    }

    addUser(user) {
        log.info('Adding user: ' + user.name);
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
        log.info('Adding session for ' + user.name);
        this.query(user).sessions.push(session);

        if (!this.isDev) {
            this.syncSheets(user);
        }
        this.updateFile();
    }

    filterSessions(sessions, filter) {
        if (typeof filter === 'string') {
            return sessions.filter(session => moment(session.start).weekday() === moment.weekdays().indexOf(filter));
        } else if (Array.isArray(filter)) {
            return sessions.filter(session => moment(session.start).isBetween(moment(filter[0]), moment(filter[1])));
        }
    }

    query(query) {
        return this.users.find(user => Object.keys(query)
            .every(key => query[key] === user[key])
        );
    }

	 getMainSheet(info) {
			for (var sheetIndex = 0; sheetIndex < info.worksheets.length; sheetIndex){
				if(!this.config.sheets.worksheet_name) break;
				if(this.config.sheets.worksheet_name === info.worksheets[sheetIndex].title) return sheetIndex;
			}
			return this.config.sheets.worksheet_id <= info.worksheets.length ? info.worksheets[this.config.sheets.worksheet_id] : 0;
	 }

    getTotalTime(sessions) {
        return sessions.reduce((acc, cur) => acc + moment(cur.end).diff(moment(cur.start)), 0);
    }

    getTotalDays(sessions) {
        return sessions.filter((session, index) => index === 0 || !moment(session.start).isSame(moment(sessions[index - 1].start), 'day')).length;
    }
}

let instance = new DB();

export default instance;
