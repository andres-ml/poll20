import GameItem from '../../components/room/game-item.js'
import Logic from '../../logic.js';

function getGameHistory(room, game) {
    return room.history.filter(session => session.game === game.name);
}

export default {
    template: /*html*/`
        <div>
            <div class="field" v-if="!noGames">
                <div class="control is-expanded has-icons-left">
                    <fa :icon="'sort-amount-asc'" class="is-left"/>
                    <div class="select is-fullwidth">
                        <select class="" v-model="sortBy">
                            <option v-for="(criteria, key) in sortCriteria" :value="key">Sort by {{ criteria.text }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="game-list item-list">
                <i v-if="noGames">You have no games. Try adding some</i>
                <!-- first show the ones tied with the most votes -->
                <game-item class="item" v-for="game in sortedGames.slice(0, winningGamesThreshold)" :game="game" :key="game.name" :user="user" :room="room"></game-item>
                <!-- then show the winner select -->
                <div class="field" v-if="!noGames">
                    <div class="control is-expanded has-icons-left">
                        <fa :icon="'plus'" class="is-left has-text-success"/>
                        <div class="select is-fullwidth">
                            <select class="" v-model="winnerGame">
                                <option value="">Log new session</option>
                                <option v-for="game in sortedGames" :value="game.name">Log {{ game.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="field" v-if="winnerGame">
                    <div class="control is-expanded has-icons-left">
                        <fa :icon="'trophy'" class="is-left has-text-warning"/>
                        <div class="select is-fullwidth">
                            <select class="" v-model="winnerUser">
                                <option value="">Choose winner (optional)</option>
                                <option v-for="user in room.members" :value="user.id">{{ user.name }}</option>
                                <option value="everyone">Everyone (co-op)</option>
                                <option value="nobody">Nobody (co-op)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="columns is-mobile" v-if="winnerGame">
                    <div class="column">
                        <button class="button is-fullwidth is-primary" @click="logSession">
                            <fa :icon="'plus'"/> <span>Log session</span>
                        </button>
                    </div>
                    <div class="column">
                        <button class="button is-fullwidth is-light" @click="cancelSessionLog">
                            <fa :icon="'times'"/> <span>Cancel</span>
                        </button>
                    </div>
                </div>
                <!-- then show the rest -->
                <game-item class="item" v-for="game in sortedGames.slice(winningGamesThreshold)" :game="game" :key="game.name" :user="user" :room="room"></game-item>
            </div>

            <hr>

            <div class="columns is-mobile">
                <div class="column">
                    <div class="field">
                        <input class="input" placeholder="Add new game" v-model="gameName" @keyup.enter="addGame">
                    </div>
                </div>
                <div class="column is-narrow">
                    <button class="button is-primary" @click="addGame">
                        <fa :icon="'plus'"/><span class="is-hidden-mobile"> Add game</span>
                    </button>
                </div>
            </div>

            <div class="notification is-warning" v-if="!valid">
                Please, enter a name
            </div>

        </div>
    `,
    components: {
        'game-item': GameItem
    },
    props: ['room', 'user'],
    data: function() {
        return {
            gameName: '',
            winnerGame: '',
            winnerUser: '',
            valid: true,
            sortBy: 'votes',
            sortCriteria: {
                votes: {
                    text: 'Most votes',
                    score: (game) => {
                        return -Logic.gameScore(game);
                    }
                },
                lastPlayed: {
                    text: 'Last played',
                    score: (game) => {
                        const gameHistory = getGameHistory(this.room, game);
                        if (gameHistory.length === 0) {
                            return 0;
                        }
                        const date = gameHistory[gameHistory.length - 1].created;
                        return -moment(date).toDate().getTime();
                    }
                },
                mostPlayed: {
                    text: 'Most played',
                    score: (game) => {
                        const gameHistory = getGameHistory(this.room, game);
                        return -gameHistory.length;
                    }
                },
                alphabetically: {
                    text: 'A-Z',
                    score: (game) => {
                        return 0; // alphabetically is already the default tiebreaker
                    }
                },
            },
        };
    },
    computed: {
        noGames: function() {
            return this.room.games.length === 0;
        },
        sortedGames: function() {
            return _(this.room.games)
                .map(game => {
                    game.score = this.sortCriteria[this.sortBy].score(game);
                    return game;
                })
                .sortBy((game) => [game.score, game.name])
                .value();
        },
        winningGamesThreshold: function() {
            if (this.sortBy !== 'votes') {
                return 0;
            }
            return this.sortedGames.filter(game => game.score === this.sortedGames[0].score).length;
        },
    },
    methods: {
        addGame: function() {
            this.valid = !!this.gameName;
            if (this.valid) {
                this.room.games.push(Logic.createGame(this.gameName));
                this.gameName = ""
            }
        },
        cancelSessionLog: function() {
            this.winnerGame = this.winnerUser = "";
        },
        logSession: function() {
            this.room.history.push(Logic.logSession(this.winnerGame, this.winnerUser))
            this.cancelSessionLog();
        },
    },
}