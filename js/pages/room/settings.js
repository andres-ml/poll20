import State from '../../state.js'

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
                        <button class="button is-info is-fullwidth tooltip" data-tooltip="Copy link to clipboard" @click="copy('inviteLink')">
                            <fa :icon="'clipboard'"/>
                        </button>
                    </div>
                </div>

                <label class="">Do you want to log in with another device or browser? Use this link:</label>
                <div class="field has-addons">
                    <div class="control is-expanded">
                        <input class="input" readonly v-model="inviteLinkSelf" ref="inviteLinkSelf">
                    </div>
                    <div class="control" style="min-width: 50px">
                        <button class="button is-info is-fullwidth tooltip" data-tooltip="Copy link to clipboard" @click="copy('inviteLinkSelf')">
                            <fa :icon="'clipboard'"/>
                        </button>
                    </div>
                </div>
                
                <notification type="success" :if="recentlyCopied">
                    Link copied to clipboard
                </notification>
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
                                <option v-for="game in R.sortBy(R.prop('name'), room.games)" :value="game.id">{{ game.name }}</option>
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
                <notification type="info" :if="!!gameDeletedNotification">
                    {{ gameDeletedNotification }}
                </notification>
            </div>

            <hr>

            <div class="container">
                <label class="label">Kick user</label>
                <div class="field">
                    <div class="control has-icons-left is-expanded">
                        <fa :icon="'times'" class="is-left has-text-danger"/>
                        <div class="select is-fullwidth">
                            <select class="" v-model="memberIdToKick">
                                <option value="">Choose user</option>
                                <option v-for="member in R.sortBy(R.prop('name'), room.members)" :value="member.id">{{ member.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="columns" v-if="memberIdToKick">
                    <div class="column" @click="kickMember">
                        <button class="button is-danger is-fullwidth">
                            Kick {{ memberToKick.name }}
                        </button>
                    </div>
                    <div class="column">
                        <button class="button is-light is-fullwidth" @click="memberIdToKick = ''">
                            Cancel
                        </button>
                    </div>
                </div>
                <notification type="info" :if="!!memberKickedNotification">
                    {{ memberKickedNotification }}
                </notification>
            </div>

            <hr>

            <div class="field">
                <button class="button is-danger is-fullwidth" @click="confirmRoomLeave = true">
                    {{ confirmRoomLeave ? 'Are you sure?' : 'Leave room' }}
                </button>
            </div>
            <div class="columns" v-if="confirmRoomLeave">
                <div class="column">
                    <button class="button is-danger is-fullwidth" @click="loadWhile(leaveRoom)">
                        Leave {{ room.name }}
                    </button>
                </div>
                <div class="column">
                    <button class="button is-light is-fullwidth" @click="confirmRoomLeave = false">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `,
    props: ['room', 'member'],
    data: function() {
        return {
            recentlyCopied: false,
            gameIdToDelete: '',
            gameDeletedNotification: '',
            memberIdToKick: '',
            memberKickedNotification: '',
            confirmRoomLeave: false,
        }
    },
    computed: {
        inviteLink: function() {
            const href = window.location.href;
            const root = href.substring(0, href.length - window.location.hash.length - 1);
            return [root, '#/join', this.room.id].join('/');
        },
        inviteLinkSelf: function() {
            return this.inviteLink + '/' + this.member.id;
        },
        gameToDelete: function() {
            return this.room.games.find(R.propEq('id', this.gameIdToDelete));
        },
        memberToKick: function() {
            return this.room.members.find(R.propEq('id', this.memberIdToKick));
        },
    },
    methods: {
        copy: function(property) {
            this.$refs[property].select();
            document.execCommand('copy');
            this.flashSet(this, 'recentlyCopied', true, false);
        },
        deleteGame: function() {
            this.room.games.splice(this.room.games.indexOf(this.gameToDelete), 1);
            // if we wanted to delete history too:
            // this.room.history = this.room.history.filter(session => session.game !== this.gameToDelete.name)

            this.gameIdToDelete = ''
            this.flashSet(this, 'gameDeletedNotification', 'Game deleted successfully')
        },
        kickMember: function() {
            State.leaveRoom(this.memberToKick, this.room)
            this.memberIdToKick = '';
            this.flashSet(this, 'memberKickedNotification', 'User kicked successfully')
        },
        leaveRoom: function() {
            return State.leaveRoom(this.member, this.room)
                .then(() => this.$router.push({name: 'rooms'}));
        }
    }
}