import GameItem from '../../components/room/game-item.js'
import SessionLogger from '../../components/room/session-logger.js'
import Logic from '../../logic.js';

function getGameHistory(room, game) {
    return room.history.filter(session => session.game === game.name);
}

export default {
    template: /*html*/`
        <div>
            <div class="field" v-if="!noGames">
                <div class="columns is-mobile">
                    <div class="column">
                        <div class="control is-expanded has-icons-left">
                            <fa :icon="'sort-amount-down-alt'" class="is-left"/>
                            <div class="select is-fullwidth">
                                <select class="" v-model="sortBy">
                                    <option v-for="(criteria, key) in sortCriteria" :value="key">Sort by {{ criteria.text }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="column is-narrow">
                        <button class="button is-light" @click="attendanceVisible = !attendanceVisible">
                            <fa icon="map-marker-alt"/>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="attendanceVisible">
                <div class="attendance">
                    <div class="columns is-mobile">
                        <div class="column"></div>
                        <div class="column is-2 clickable is-tooltip" data-tooltip="Attendees" @click="toggleAttendance">
                            <fa icon="map-marker-alt" class="has-text-danger"/>
                        </div>
                    </div>
                    <div class="columns is-mobile" v-for="user in room.members" :key="user.id">
                        <div class="column">{{ user.name }}</div>
                        <div class="column is-2">
                            <checkbox :id="'attendance-' + user.id" :value="user.id" v-model="attendees"/>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <i v-if="noGames">You have no games. Try adding some</i>
                <transition-group name="reorder-list" class="game-list item-list">
                    <!-- first show the ones tied with the most votes -->
                    <game-item class="item" v-for="game in sortedGames.slice(0, winningGamesThreshold)" :game="game" :attendees="attendees" :key="game.id" :member="member" :room="room"></game-item>
                    <!-- then show the winner select -->
                    <session-logger v-if="!noGames" :room="room" :games="sortedGames" :attendees="attendees" key="logger"/>
                    <!-- then show the rest -->
                    <game-item class="item" v-for="game in sortedGames.slice(winningGamesThreshold)" :game="game" :attendees="attendees" :key="game.id" :member="member" :room="room"></game-item>
                </transition-group>
            </div>

            <hr>

            <div class="columns is-mobile">
                <div class="column">
                    <div class="field">
                        <input class="input" placeholder="Add new game" v-model="gameName" @keyup.enter="addGame" ref="gameName">
                    </div>
                </div>
                <div class="column is-narrow">
                    <button class="button is-primary" @click="addGame">
                        <fa :icon="'plus'"/><span class="is-hidden-mobile"> Add game</span>
                    </button>
                </div>
            </div>

            <notification type="warning" :if="!valid">
                Please, enter a name
            </notification>

        </div>
    `,
    components: {
        'game-item': GameItem,
        'session-logger': SessionLogger,
    },
    props: ['room', 'member'],
    data: function() {
        return {
            gameName: '',
            valid: true,
            sortBy: 'votes',
            attendanceVisible: false,
            attendees: this.room.members.map(member => member.id),
            sortCriteria: {
                votes: {
                    text: 'Most votes',
                    score: (game) => {
                        const voteTotal = Logic.gameScore(game, this.attendees);
                        const downvotes = Logic.gameScore(game, this.attendees, {up: 0, down: 1});
                        // sort first by highest vote count; break ties by the least amount of downvotes
                        return [-voteTotal, downvotes];
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
            const randomGenerator = new Math.seedrandom(moment().format('yyyy MM dd'));
            const assignRandomPositionForTieBreaking = game => R.merge(game, {randomPosition: randomGenerator()});
            const assignScoreByCurrentCriteria = game => R.merge(game, {score: this.sortCriteria[this.sortBy].score(game)});

            const sort = R.compose(
                R.sort(R.tieBreaker(game => [game.score, game.randomPosition])),
                R.map(assignScoreByCurrentCriteria),
                R.map(assignRandomPositionForTieBreaking)
            );

            return sort(this.room.games);
        },
        winningGamesThreshold: function() {
            if (this.sortBy !== 'votes') {
                return 0;
            }
            return this.sortedGames.filter(game => game.score[0] === this.sortedGames[0].score[0]).length;
        },
    },
    methods: {
        toggleAttendance() {
            if (this.attendees.length === this.room.members.length) {
                this.attendees = [];
            }
            else {
                this.attendees = this.room.members.map(member => member.id);
            }
        },
        addGame: function() {
            this.valid = !!this.gameName;
            if (this.valid) {
                this.room.games.push(Logic.createGame(this.gameName));
                this.gameName = ""
            }
            this.$refs['gameName'].focus();
        },
    },
}