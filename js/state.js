import OnlineStorage from './lib/online-storage.js'
import Logic from './logic.js';

function mergeRooms(base, current, userId) {
    base.games.forEach(game => {
        const match = current.games.find(game2 => game2.id === game.id)
        if (match && userId) {
            game.votes = _.merge(...[
                _.pick(game.votes, [userId]),
                _.omit(match.votes, [userId])
            ]);
        }
    });
    return base;
}

export default {
    load: function() {
        let user = store.get('user');
        if (user === undefined) {
            user = Logic.createUSer();
            this.save({ user })
        }
        return { user };
    },
    save: function(state) {
        const user = state.user;
        store.set('user', user);
        return state;
    },
    reset: async function() {
        store.remove('user')
    },
    loadRoom: async function(roomId) {
        return await OnlineStorage.load("poll20-room-" + roomId);
    },
    saveRoom: async function(room, userId = undefined) {
        if (userId) {
            const current = await this.loadRoom(room.id);
            room = mergeRooms(room, current, userId);
        }
        return await OnlineStorage.save("poll20-room-" + room.id, room);
    },
    createRoom: function(user, roomName, userName) {
        const room = Logic.createRoom(user.id, roomName, userName);
        return this.saveRoom(room)
            .then(room => user.rooms.push(room.id))
    },
    leaveRoom: function(user, room) {
        const member = room.members.find(member => member.id === user.id)
        room.members.splice(room.members.indexOf(member), 1);
        return this.saveRoom(room)
            .then(_ => user.rooms.splice(user.rooms.indexOf(room.id), 1));
    },
}