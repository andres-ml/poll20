import State from '../state.js'

const Rooms = {
    template: /*html*/`
        <section class="section">
            <div class="container" v-if="!loading">
                <div class="rooms item-list">
                    <p v-if="rooms.length === 0">You have no rooms. Create one or ask a friend for an invite</p>
                    <router-link :to="{name: 'room-poll', params: {id: room.id}}" class="room item button is-light-blue" v-for="room in rooms" :key="room.id" :room="room">
                        <div class="title">{{ room.name }}</div>
                        <div class="subtitle"><fa :icon="'user'"/> : {{ room.members.map(member => member.name).join(', ') }}</div>
                    </router-link>
                </div>
                <hr>
                <div class="buttons">
                    <router-link to="/create" class="button is-fullwidth is-primary">Create room</router-link>
                </div>
            </div>
            <loading v-else/>
        </section>
    `,
    props: ['state'],
    data: function() {
        return {
            loading: true,
            rooms: [],
        }
    },
    created: function() {
        Promise
            .all(this.state.user.rooms.map(State.loadRoom))
            .then(rooms => {
                this.rooms = rooms;
                this.loading = false;
            });
    },
}
  
export default Rooms