import GameItem from '../../components/room/game-item.js'
import Logic from '../../logic.js';

export default {
    template: /*html*/`
        <div>

            <div class="game-list item-list">
                <i v-if="room.games.length === 0">You have no games. Try adding some</i>
                <game-item class="item" v-for="game of room.games" :game="game" :key="game.name"></game-item>
            </div>

            <hr>

            <div class="columns is-mobile">
                <div class="column">
                    <div class="field">
                        <input class="input" placeholder="Game name" v-model="gameName" @keyup.enter="addGame">
                    </div>
                </div>
                <div class="column is-narrow">
                    <button class="button is-primary">
                        <fa :icon="'plus'"/><span class="is-hidden-touch"> Add game</span>
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
    props: ['room'],
    data: function() {
        return {
            gameName: '',
            valid: true,
        }
    },
    methods: {
        addGame: function() {
            this.valid = !!this.gameName;
            if (this.valid) {
                this.room.games.push(Logic.createGame(this.gameName));
            }
        }
    },
}