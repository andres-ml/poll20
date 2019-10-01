import State from '../state.js'

const RoomJoin = {
    template: /*html*/`
        <section class="section">
            <div class="container" v-if="room">
                <h1 class="subtitle">You've been invited to join room <strong>{{ room.name }}</strong></h1>
                <div class="field">
                    <input class="input" placeholder="Your username" v-model="userName" @keyup.enter="joinRoom" ref="userName">
                </div>
                <div class="notification is-warning" v-if="!valid">
                    Please enter your username
                </div>
                <button class="button is-primary is-fullwidth" @click="loadWhile(joinRoom)">
                    Join room
                </button>
            </div>
        </section>
    `,
    data: function() {
        return {
            userName: '',
            valid: true,
            room: null,
        };
    },
    props: ['state'],
    created: function() {
        State.loadRoom(this.$route.params.id)
            .then(room => this.room = room)
            .then(() => {
                // user already in room
                if (this.state.user.rooms.indexOf(this.room.id) !== -1) {
                    this.$router.push({name: 'rooms'});
                }
                else {
                    this.$refs['userName'].focus();
                }
            });
    },
    methods: {
        joinRoom: function() {
            this.valid = !!this.userName;
            if (!this.valid) {
                return;
            }

            this.room.members.push({
                id: this.state.user.id,
                name: this.userName
            });
            
            return State.saveRoom(this.room)
                .then(() => {
                    this.state.user.rooms.push(this.room.id);
                    this.$router.push({name: 'rooms'});
                });
        }
    }
}
  
export default RoomJoin