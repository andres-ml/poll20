import {autoFocus} from '../components/mixins/autofocus.js'
import Logic from '../logic.js';

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
                <button class="button is-primary is-fullwidth" :class="isSaving ? 'is-loading' : ''" @click="createRoom">
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
            isSaving: false,
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

            this.isSaving = true;
            const room = Logic.createRoom(this.state.user.id, this.roomName, this.userName);
            State.saveRoom(room.id, room)
                .then(room => {
                    this.state.user.rooms.push(room.id);
                    this.$router.push({name: 'rooms'});  
                    this.isSaving = false;
                })
        }
    }
}
  
export default RoomCreate