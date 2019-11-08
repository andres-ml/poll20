import State from '../state.js'
import { randomString } from '../lib/utils.js';

const RoomJoin = {
    template: /*html*/`
        <section class="section">
            <div class="container" v-if="room">
                <h1 class="subtitle">You've been invited to join room <strong>{{ room.name }}</strong></h1>
                <div v-if="!userSpecified">
                    <div class="field">
                        <input class="input" placeholder="Your username" v-model="userName" @keyup.enter="handleJoin" ref="userName">
                    </div>
                    <div class="notification is-warning" v-if="!valid">
                        Please enter your username
                    </div>
                    <button class="button is-primary is-fullwidth" @click="loadWhile(handleJoin)">
                        Join room
                    </button>
                </div>
            </div>
        </section>
    `,
    data: function() {
        return {
            userName: '',
            valid: true,
            room: null,
            userSpecified: this.$route.params.userId
        };
    },
    props: ['state'],
    created: function() {
        State.loadRoom(this.$route.params.id)
            .then(room => this.room = room)
            .then(this.initialize);
    },
    methods: {
        initialize() {
            // user already in room
            const userRoom = this.state.user.rooms.find(R.propEq('id', this.room.id));
            if (userRoom) {
                this.$router.push({name: 'rooms'});
                return;
            }

            // user already specified, and valid
            const userId = this.$route.params.userId;
            const matchingMember = this.room.members.find(R.propEq('id', userId));
            if (matchingMember) {
                this.joinRoom(matchingMember, false)
                return;
            }
            
            this.userSpecified = false;
            Vue.nextTick(() => this.$refs['userName'].focus()); // ref has not been drawn yet since we toggle it right away; wait for next tick
        },
        handleJoin: function() {
            this.valid = !!this.userName;
            if (!this.valid) {
                return;
            }

            this.joinRoom({
                id: randomString(),
                name: this.userName,
            }, true);
        },
        joinRoom(member, isNew) {
            if (isNew) {
                this.room.members.push(member);
            }

            return State.saveRoom(this.room, member.id)
                .then(() => {
                    this.state.user.rooms.push({
                        id: this.room.id,
                        userId: member.id,
                    });
                    this.$router.push({name: 'rooms'});
                });
        }
    }
}
  
export default RoomJoin