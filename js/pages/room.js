import State from '../state.js'

const Room = {
    template: /*html*/`
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
    `,
    props: ['state'],
    data: function() {
        return {
            room: null,
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
    },
    methods: {
        syncRoom: function() {
            State.saveRoom(_.cloneDeep(this.room), this.state.user.id)
                .then(room => {
                    if (!_.isEqual(room, this.room)) {
                        this.room = room;
                    }
                });
        }
    }
}
  
export default Room