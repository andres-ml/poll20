import Logic from '../../logic.js';

export default {
    template: /*html*/`
        <div>
            <div class="field">
                <div class="control is-expanded has-icons-left">
                    <fa :icon="'plus'" class="is-left has-text-success"/>
                    <div class="select is-fullwidth">
                        <select class="" v-model="winnerGame">
                            <option value="">Log new session</option>
                            <option v-for="game in games" :value="game.name">Log {{ game.name }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div v-if="winnerGame">
                <div class="attendance" style="background: white">
                    <div class="columns is-mobile">
                        <div class="column"></div>
                        <div class="column is-2 clickable is-tooltip" data-tooltip="Winners" @click="toggleAttendance('winners')">
                            <fa icon="trophy" class="has-text-warning""/>
                        </div>
                        <div class="column is-2 clickable is-tooltip" data-tooltip="Attendees" @click="toggleAttendance('attendees')">
                            <fa icon="map-marker" class="has-text-error""/>
                        </div>
                    </div>
                    <div class="columns is-mobile" v-for="user in room.members" :key="user.id">
                        <div class="column">{{ user.name }}</div>
                        <div class="column is-2">
                            <checkbox :id="'victory-' + user.id" :value="user.id" v-model="winners"/>
                        </div>
                        <div class="column is-2">
                            <checkbox :id="'attendance-' + user.id" :value="user.id" v-model="attendees"/>
                        </div>
                    </div>
                </div>
                <div class="comments" style="margin: 10px auto">
                    <textarea class="textarea" rows="2" v-model="sessionComments" placeholder="Any comments about the game?"></textarea>
                </div>
                <div class="columns is-mobile">
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
                <hr>
            </div>
            <notification :if="!!sessionLoggedMessage">
                {{ sessionLoggedMessage }}
            </notification>
        </div>
    `,
    props: ['room', 'games'],
    data: function() {
        return {
            winnerGame: '',
            winners: [],
            attendees: this.room.members.map(member => member.id),
            sessionLoggedMessage: '',
            sessionComments: '',
        }
    },
    computed: {
        noGames() {
            return this.games.length === 0;
        },
    },
    methods: {
        toggleAttendance(prop) {
            if (this[prop].length === this.room.members.length) {
                this[prop] = [];
            }
            else {
                this[prop] = this.room.members.map(member => member.id);
            }
        },
        cancelSessionLog() {
            this.winnerGame = '';
        },
        logSession() {
            const attendees = this.room.members.filter(member => this.attendees.includes(member.id))
            this.room.history.push(Logic.logSession(this.winnerGame, {
                winners: this.winners,
                attendees: attendees,
                comments: this.sessionComments,
            }));
            this.cancelSessionLog();
            this.flashSet(this, 'sessionLoggedMessage', 'Session logged!')
        },
    },
}