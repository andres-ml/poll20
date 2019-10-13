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
    gameScore: (game, attendees = null) => {
        const weights = {
            'up': 1,
            'down': -1
        };
        return _(game.votes)
            .filter((user, userId) => attendees === null || (attendees.indexOf(userId) !== -1))
            .map(vote => weights[vote.type]).sum();
    },
    logSession: (game, config = {}) => {
        return _.merge({
            game,
            created: new Date(),
            winners: [],
            attendees: [],
            comments: ''
        }, config);
    }
}