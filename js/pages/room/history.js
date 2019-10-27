import HistoryItem from "../../components/room/history-item.js";

export default {
    template: /*html*/`
        <div>
            <div v-for="(sessions, label) in sessionsByRange" style="margin-bottom: 2rem">
                <h1 class="subtitle">{{ label }}</h1>
                <history-item v-for="session in sessions" :session="session" :key="session.index" @delete="deleteSession"/>
            </div>
            <div class="notification is-info" v-if="room.history.length === 0">
                No games played yet. Log your sessions in the poll section
            </div>
        </div>
    `,
    props: ['room'],
    components: {
        'history-item': HistoryItem
    },
    computed: {
        winnerList: function() {

        },
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

            return R.pipe(
                R.addIndex(R.map)((session, index) => {
                    session.index = index;
                    return session;
                }),
                R.reverse,
                R.groupBy((session) => {
                    const firstMatchingRange = R.find(range => range.threshold === null || range.threshold < moment(session.created), ranges)
                    return firstMatchingRange.label;
                })
            )(this.room.history)
        }
    },
    methods: {
        deleteSession(index) {
            this.room.history.splice(index, 1)
        },
    }
}