import TopRoom from '../components/top-room.js'
import State from '../state.js'
import Foot from '../components/foot.js'

const Room = {
    template: /*html*/`
    <div>
        <top-room :room="room"/>
        <hr style="margin: 0px">
        <div>
            <div class="room" v-if="room">
                <div class="level inline-level is-mobile">
                    <div class="level-item" v-for="route of childrenRoutes">
                        <router-link :to="route" replace class="button is-light-blue is-fullwidth tooltip" :data-tooltip="route.meta.name" style="height: 75px">
                            <fa class="is-large" :icon="route.meta.icon + ' fa-lg'"/>
                        </router-link>
                    </div>
                </div>
                <section class="section">
                    <router-view :room="room" :user="state.user"></router-view>
                </section>
            </div>
            <loading v-else/>
        </div>
        <foot/>
    </div>
    `,
    props: ['state'],
    data: function() {
        return {
            room: null,
            show: false,
        }
    },
    created: function() {
        this.childrenRoutes = this.$router.options.routes.find((route) => route.path === '/room/:id').children;
        State.loadRoom(this.$route.params.id)
            .then(room => this.room = room)
            .then(() => {
                this.$watch('room', _.debounce(this.syncRoom, 1000), {
                    deep: true
                });
            });
        setTimeout(() => this.show = true, 500);
        setTimeout(() => this.show = false, 2000);
    },
    methods: {
        syncRoom: function() {
            State.saveRoom(R.clone(this.room), this.state.user.id);
        }
    },
    components: {
        'top-room': TopRoom,
        'foot': Foot,
    }
}
  
export default Room