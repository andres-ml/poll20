export default {
    template: /*html*/`
        <div>
            <div v-for="(sessions, label) in sessionsByRange" style="margin-bottom: 2rem">
                <h1 class="subtitle">{{ label }}</h1>
                <div class="notification is-light" v-for="session in sessions">
                    <div class="columns is-vcentered">
                        <div class="column">
                            Played <strong>{{ session.game }}</strong> {{ session.created | fromNow }}
                        </div>
                        <div class="column has-text-right" v-if="session.winner">
                            <strong>Winner:</strong> {{ formatWinner(session.winner) }}
                        </div>
                        <button class="delete" style="margin-left: 10px" @click="room.history.splice(session.index, 1)"></button>
                    </div>
                </div>
            </div>
            <div class="notification is-info" v-if="room.history.length === 0">
                No games played yet. Log your sessions in the poll section
            </div>
        </div>
    `,
    props: ['room'],
    computed: {
        sessionsByRange: function() {
            const ranges = [
                {
                    label: 'This week',
                    threshold: moment().subtract(1, 'week')
                },
                {
                    label: 'This month',
                    threshold: moment().subtract(1, 'month')
                },
                {
                    label: 'More than one month ago',
                    threshold: null
                }
            ];

            return _(this.room.history)
                .map((session, index) => {
                    session.index = index;
                    return session;
                })
                .reverse()
                .groupBy((session) => {
                    return _.find(ranges, (range) => range.threshold === null || range.threshold < moment(session.created)).label;
                })
                .value();
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