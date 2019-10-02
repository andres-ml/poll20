import {randomString} from './lib/utils.js'

export default {
    createUSer: () => {
        return {
            id: randomString(),
            rooms: [],
        }
    },
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
            id: randomString(),
            name,
            votes: {},
        }
    },
    gameScore: (game, userId = null) => {
        const weights = {
            'up': 1,
            'down': -1
        };
        return _(game.votes)
            .filter((_, key) => userId === null || userId === key)
            .map(vote => weights[vote.type]).sum();
    },
    logSession: (game, winners, attendees) => {
        return {
            game,
            winners,    // list of member ids
            attendees,  // list of member objects
            created: new Date()
        }
    }
}