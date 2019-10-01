export default {
    template: /*html*/`
        <div>
            <div class="container">
                <label class="label"><fa icon="magic"/> Room invite link <fa icon="magic"/></label>
                <div class="field has-addons">
                    <div class="control is-expanded">
                        <input class="input" readonly v-model="inviteLink" ref="inviteLink">
                    </div>
                    <div class="control" style="min-width: 50px">
                        <button class="button is-info is-fullwidth tooltip" data-tooltip="Copy link to clipboard" @click="copyInvite">
                            <fa :icon="'clipboard'"/>
                        </button>
                    </div>
                </div>
                <div class="notification is-success" v-if="recentlyCopied">
                    Link copied to clipboard
                </div>
            </div>

            <hr>

            <div class="container">
                <label class="label">Delete game</label>
                <div class="field">
                    <div class="control has-icons-left is-expanded">
                        <fa :icon="'times'" class="is-left has-text-danger"/>
                        <div class="select is-fullwidth">
                            <select class="" v-model="gameIdToDelete">
                                <option value="">Choose game</option>
                                <option v-for="game in _.sortBy(room.games, 'name')" :value="game.id">{{ game.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="columns" v-if="gameIdToDelete">
                    <div class="column" @click="deleteGame">
                        <button class="button is-danger is-fullwidth">
                            Delete {{ gameToDelete.name }}
                        </button>
                    </div>
                    <div class="column">
                        <button class="button is-light is-fullwidth" @click="gameIdToDelete = ''">
                            Cancel
                        </button>
                    </div>
                </div>
                <div class="notification is-info" v-if="gameDeletedNotification">
                    {{ gameDeletedNotification }}
                </div>
            </div>

            <hr>

            <button class="button is-danger is-fullwidth">
                Leave room
            </button>
        </div>
    `,
    props: ['room'],
    data: function() {
        return {
            recentlyCopied: false,
            gameIdToDelete: '',
            gameDeletedNotification: '',
        }
    },
    computed: {
        inviteLink: function() {
            return [window.location.origin, '#/join', this.room.id].join('/');
        },
        gameToDelete: function() {
            return this.room.games.find(game => game.id == this.gameIdToDelete);
        }
    },
    methods: {
        copyInvite: function() {
            this.$refs['inviteLink'].select();
            document.execCommand('copy');
            this.flashSet(this, 'recentlyCopied', true, false);
        },
        deleteGame: function() {
            this.room.games.splice(this.room.games.indexOf(this.gameToDelete), 1);
            // we could choose not to keep the history, but we do for now
            // this.room.history = this.room.history.filter(session => session.game !== this.gameToDelete.name)

            this.gameIdToDelete = ''
            this.flashSet(this, 'gameDeletedNotification', 'Game deleted successfully')
        },
    }
}