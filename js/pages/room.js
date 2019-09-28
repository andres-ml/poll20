const Room = {
    template: /*html*/`
        <section class="section">
            <div class="container">
                <div class="room-name" style="font-size: 24px">{{ room.name }}</div>
            </div>
        </section>
    `,
    props: ['state'],
    data: function() {
        return {
            room: this.state.rooms.find(room => this.$route.params.id == room.id),
        }
    },
}
  
export default Room