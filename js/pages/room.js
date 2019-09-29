const Room = {
    template: /*html*/`
        <div class="room">
            <div class="level inline-level is-mobile">
                <div class="level-item" v-for="route of childrenRoutes">
                    <router-link :to="route" replace class="button is-light is-fullwidth tooltip" :data-tooltip="route.meta.name" style="height: 75px">
                        <fa class="is-large" :icon="route.meta.icon + ' fa-lg'"/>
                    </router-link>
                </div>
            </div>
            <section class="section">
                <router-view :room="room"></router-view>
            </section>
        </div>
    `,
    props: ['state'],
    created: function() {
        this.childrenRoutes = this.$router.options.routes.find((route) => route.path === '/room/:id').children;
    },
    mounted: function() {
        document.body.querySelector('.top .title').innerText = this.room.name;
        document.body.querySelector('.top .subtitle').innerText = this.room.name;
    },
    data: function() {
        return {
            room: this.state.rooms.find(room => this.$route.params.id == room.id),
        }
    },
}
  
export default Room