class MockDB {
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
        user = Object.assign({}, user);

        delete user.time_in;

        this.query(user).total_time += time;
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
        if (instance === undefined) instance = new MockDB();
        return instance;
    }
}
