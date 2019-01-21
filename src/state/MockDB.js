export default class MockDB {
    constructor() {
        this.users = [{
            name: 'Brandon Lou',
            id: '.',
            total_time: 0
        }];
    }

    addUser(user) {
        if (this.query(user)) return;

        this.users.push({
            name: user.name,
            id: user.id,
            total_time: 0
        });
    }

    addTime(user, time) {
        this.query(user).total_time += time;
    }

    query(query) {
        return this.users.find(user => Object.keys(query)
            .map(key => query[key] === user[key])
            .every( _ => _)
        );
    }
}
