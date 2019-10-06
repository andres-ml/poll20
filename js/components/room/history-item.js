export default {
    template: /*html*/`
        <div class="notification is-light-blue">
            Played <strong>{{ session.game }}</strong> {{ session.created | fromNow }}
            <br>
            <br>
            <p><strong>{{ 'Player' | pluralize(session.attendees) }}:</strong> {{ session.attendees.map(attendee => attendee.name).join(', ') }}</p>
            <p><strong>{{ 'Winner' | pluralize(session.winners) }}:</strong> {{ winnerList }}</p>
            <p class="history-item-comments" v-if="session.comments">{{ session.comments }}</p>
            <button class="delete" style="margin-left: 10px" @click="$emit('delete', session.index)"></button>
        </div>
    `,
    props: ['session'],
    computed: {
        winnerList() {
            const winners = this.session.winners;
            const attendees = this.session.attendees;
            if (winners.length === attendees.length) {
                return 'Everyone';
            }
            if (winners.length === 0) {
                return 'Nobody';
            }
            return winners.map(id => attendees.find(attendee => attendee.id === id)).map(attendee => attendee.name).join(', ');
        }
    },
    methods: {
        formatWinner: function(value) {
            if (!value) {
                return '';
            }
            const fixed = {
                everyone: 'Everyone',
                nobody: 'Nobody',
            };
            if (value in fixed) {
                return fixed[value];
            }
            else {
                return this.room.members.find(member => member.id === value).name;
            }
        }
    }
}