import OnlineStorage from './lib/online-storage.js'
import Logic from './logic.js';

function mergeRooms(base, current, userId) {
    base.games.forEach(game => {
        const match = current.games.find(R.propEq('id', game.id))
        if (match) {
            // pick current user's votes, then the rest from the source
            game.votes = R.merge(...[
                R.pick([userId], game.votes),
                R.omit([userId], match.votes)
            ]);
        }
    });

    base.games.forEach(game => {
        game.votes = R.pick(R.map(R.prop('id'), base.members), game.votes);
    });

    // pick all users except current user, then add it if he exists in local
    base.members = R.concat(...[
        R.reject(R.propEq('id', userId), current.members),
        R.filter(R.propEq('id', userId), base.members),
    ]);

    return base;
}

export default {
    load: function() {
        let user = store.get('user');
        if (user === undefined) {
            user = Logic.createUser();
            this.save({ user })
        }
        if ('id' in user) {
            user.rooms = user.rooms.map(roomId => {
                return {
                    id: roomId,
                    userId: user.id
                }
            });
            delete user.id;
            this.save({ user });
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
        const room = Logic.createRoom(roomName, userName);
        return this.saveRoom(room)
            .then(room => user.rooms.push({
                id: room.id,
                userId: room.members[0].id
            }));
    },
    leaveRoom: function(member, room) {
        room.members.splice(room.members.indexOf(member), 1);
        return this.saveRoom(room);
    },
}