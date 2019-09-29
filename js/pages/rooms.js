const Rooms = {
    template: /*html*/`
        <section class="section">
            <div class="container">
                <div class="rooms item-list">
                    <p v-if="state.rooms.length === 0">You have no rooms. Create one or join one of a friend's</p>
                    <router-link :to="{name: 'room-poll', params: {id: room.id}}" class="room item button is-light" v-for="room of state.rooms" :key="room.id">
                        <div class="title">{{ room.name }}</div>
                        <div class="subtitle"><fa :icon="'user'"/> : {{ room.members.map(member => member.name).join(', ') }}</div>
                    </router-link>
                </div>
                <hr>
                <div class="buttons">
                    <router-link to="/rooms/create" class="button is-fullwidth is-primary">Create room</router-link>
                    <router-link to="/rooms/join" class="button is-fullwidth is-text">Join room</router-link>
                </div>
            </div>
        </section>
    `,
    props: ['state'],
}
  
export default Rooms