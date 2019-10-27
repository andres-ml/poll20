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
        
        return R.pipe(
            R.pick(attendees === null ? Object.keys(game.votes) : attendees),
            R.map(vote => weights[vote.type]),
            R.values,
            R.sum,
        )(game.votes);
    },
    logSession: (game, config = {}) => {
        return R.merge({
            game,
            created: new Date(),
            winners: [],
            attendees: [],
            comments: ''
        }, config);
    }
}