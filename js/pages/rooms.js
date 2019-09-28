const Rooms = {
    template: /*html*/`
        <section class="section">
            <div class="container my-rooms" style="max-width: 500px">
                <p v-if="!state.rooms">You have no rooms. Create one or join one of a friend's</p>
                
                <router-link :to="{name: 'room', params: {id: room.id}}" class="room button is-light" v-for="room of state.rooms" :key="room.id">
                    <div class="title">{{ room.name }}</div>
                    <div class="subtitle">{{ room.members.map(member => member.name).join(', ') }}</div>
                </router-link>

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