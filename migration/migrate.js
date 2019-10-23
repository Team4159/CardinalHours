const fs = require('fs');
const path = require('path');

const moment = require('moment');
const parse = require('csv-parse/lib/sync');

const resolved = [];

const current_hours = parse(fs.readFileSync(path.resolve(__dirname, '6wpT0NkR.csv')), {
    columns: true,
    skip_empty_lines: true,
    comment: '#'
});

const _2018_2019_hours = parse(fs.readFileSync(path.resolve(__dirname, 'Public CardinalBotics Roster 2018-2019 - Friday Meetings_Hours.csv')), {
    columns: true,
    skip_empty_lines: true
});

for (let member of current_hours) {
    let imported_hours;
    const old_member = _2018_2019_hours.find(old_member => old_member.First === member["First Name"] && old_member.Last === member["Last Name"] );
    if (old_member) {
        imported_hours = member["Team Hours"] - old_member["Total Build Season Hours"] - old_member["Total Team Hours"];
        if (imported_hours < 0) {
            // probably changed ID
            imported_hours = Number(member["Team Hours"]);
        }
        // console.log(member["First Name"] + " " + member["Last Name"] + " - Veteran has " + imported_hours.toFixed(2) + " Hours");
    } else {
        imported_hours = Number(member["Team Hours"]);
        // console.log(member["First Name"] + " " + member["Last Name"] + " - Rookie has " + imported_hours.toFixed(2) + " Hours");
    }
    resolved.push({
        name: `${member["First Name"]} ${member["Last Name"]}`,
        id: member['ID'],
        sessions: [{
            start: moment(0).toISOString(),
            end: moment(0).add(imported_hours, 'hours').toISOString()
        }]
    });
}

console.log(JSON.stringify(resolved));
