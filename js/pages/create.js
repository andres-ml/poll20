import {autoFocus} from '../components/mixins/autofocus.js'
import Logic from '../logic.js';
import State from '../state.js';

const RoomCreate = {
    template: /*html*/`
        <section class="section">
            <div class="container">
                <div class="field">
                    <input class="input" placeholder="Room name" v-model="roomName" @keyup.enter="createRoom">
                </div>
                <div class="field">
                    <input class="input" placeholder="Your username for room" v-model="userName" @keyup.enter="createRoom" ref="userName">
                </div>
                <div class="notification is-warning" v-if="!valid">
                    Please, fill both fields
                </div>
                <button class="button is-primary is-fullwidth" @click="loadWhile(createRoom)">
                    Create room
                </button>
            </div>
        </section>
    `,
    data: function() {
        return {
            roomName: '',
            userName: '',
            valid: true,
        };
    },
    props: ['state'],
    mixins: [autoFocus()],
    methods: {
        createRoom: function() {
            this.valid = this.roomName && this.userName;

            if (!this.valid) {
                return;
            }

            return State.createRoom(this.state.user, this.roomName, this.userName)
                .then(() => this.$router.push({name: 'rooms'}));
        }
    }
}
  
export default RoomCreate