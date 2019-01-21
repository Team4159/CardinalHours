export default class MockDB {
    constructor() {
        this.users = [{
            name: 'Brandon Lou',
            id: '.',
            total_time: 0
        }];
    }

    addUser(user) {
        if (this.query(user)) return false;

        this.users.push({
            name: user.name,
            id: user.id,
            total_time: 0
        });

        return true;
    }

    addTime(user, time) {
        delete user.time_in;

        this.query(user).total_time += time;

        console.log(this.users);
    }

    query(query) {
        return this.users.find(user => Object.keys(query)
            .map(key => query[key] === user[key])
            .every( _ => _)
        );
    }
}
