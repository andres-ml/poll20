import {randomString} from './lib/utils.js'

export default {
    createRoom: (userId, roomName, userName) => {
        return {
            id: randomString(),
            name: roomName,
            games: [],
            members: [{
                id: userId,
                name: userName,
            }],
            history: [],
        };
    },
    createGame: (name) => {
        return {
            name,
            votes: {},
        }
    }
}