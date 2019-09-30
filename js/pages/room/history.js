export default {
    template: /*html*/`
        <div>
            <div v-for="(sessions, label) in sessionsByRange" style="margin-bottom: 2rem">
                <h1 class="subtitle">{{ label }}</h1>
                <div class="notification is-light" v-for="session in sessions">
                    <div class="columns">
                        <div class="column">
                            Played <strong>{{ session.game }}</strong> {{ session.created | fromNow }}
                        </div>
                        <div class="column has-text-right">
                            <strong>Winner:</strong> {{ formatWinner(session.winner) }}
                        </div>
                    </div>
                </div>
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
                .reverse()
                .groupBy((session) => {
                    return _.find(ranges, (range) => range.threshold === null || range.threshold < moment(session.created)).label;
                })
                .value();
        }
    },
    methods: {
        formatWinner: function(value) {
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