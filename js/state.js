import OnlineStorage from './lib/online-storage.js'
import Logic from './logic.js';

export default {
    load: function() {
        let user = store.get('user');
        if (user === undefined) {
            user = Logic.createUSer();
        }
        return { user };
    },
    save: function(state) {
        const user = state.user;
        store.set('user', state.user);
        return state;
    },
    reset: async function() {
        store.remove('user')
    },
    loadRoom: async function(roomId) {
        return await OnlineStorage.load("poll20-room-" + roomId);
    },
    saveRoom: async function(room) {
        return await OnlineStorage.save("poll20-room-" + room.id, room);
    }
    
}