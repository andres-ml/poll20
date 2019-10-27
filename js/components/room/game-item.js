export default {
    template: /*html*/`
        <div class="game-item" :class="[classList]">
            <div class="columns is-vcentered is-mobile">
                <div class="column">
                    <div style="font-size:1.25em; margin-bottom: 0.5rem">{{ game.name }}</div>
                    <div class="game-stats clickable" @click="extended = !extended">
                        <fa :icon="'arrow-up'"/><span>{{ upvoteTotal }}</span>
                        <fa :icon="'arrow-down'"/><span>{{ downvoteTotal }}</span>
                        <fa :icon="'chart-bar'"/><span>{{ history | length }}</span>
                        <fa :icon="'history'"/><span>{{ daysSinceLastPlayed | daysAgo | fallback('-') }}</span>
                    </div>
                </div>
                <div class="column is-narrow vote-icons">
                    <div class="columns">
                        <div class="column clickable" data-vote="up" @click="vote">
                            <fa :icon="'arrow-up'"/>
                        </div>
                        <div class="column clickable" data-vote="down" @click="vote">
                            <fa :icon="'arrow-down'"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="notification is-light-blue game-stats-extended" v-if="extended">
                <p v-for="vote in sortedVotes" :data-vote="vote.type">
                    <span :style="{opacity: vote.active ? 1 : 0.5}">
                        <fa :icon="'arrow-' + vote.type"/> {{ vote.name }}
                    </span>
                </p>
            </div>
        </div>
    `,
    props: ['game', 'user', 'room', 'attendees'],
    data: function() {
        return {
            extended: false,
        }
    },
    computed: {
        activeVotes() {
            return R.pick(this.attendees, this.game.votes);
        },
        history: function() {
            return this.room.history.filter((session) => session.game === this.game.name);
        },
        upvoteTotal: function() {
            return Object.values(this.activeVotes).filter(R.propEq('type', 'up')).length;
        },
        downvoteTotal: function() {
            return Object.values(this.activeVotes).filter(R.propEq('type', 'down')).length;
        },
        daysSinceLastPlayed: function() {
            const gameHistory = this.history.filter(session => session.game === this.game.name);
            if (gameHistory.length === 0) {
                return null;
            }
            return gameHistory[gameHistory.length - 1].created;
        },
        upvoted: function() {
            return this.currentVote !== null && this.currentVote.type === 'up';
        },
        downvoted: function() {
            return this.currentVote !== null && this.currentVote.type === 'down';
        },
        currentVote: function() {
            return this.user.id in this.game.votes ? this.game.votes[this.user.id] : null;
        },
        classList: function() {
            var classList = [];
            if (this.upvoted) {
                classList.push('upvoted');
            }
            else if (this.downvoted) {
                classList.push('downvoted');
            }
            return classList;
        },
        sortedVotes: function() {
            return R.pipe(
                R.toPairs,
                R.map(([userId, vote]) => {
                    return {
                        type: vote.type,
                        name: this.room.members.find(member => member.id == userId).name,
                        active: this.attendees.indexOf(userId) !== -1,
                    }
                }),
                R.sortBy(R.prop('name'))
            )(this.game.votes);
        }
    },
    methods: {
        vote: function(event) {
            const type = event.currentTarget.dataset.vote;
            const currentVote = this.currentVote;

            if (currentVote !== null) {
                this.$delete(this.game.votes, this.user.id);
            }
            
            if (currentVote === null || currentVote.type !== type) {
                this.$set(this.game.votes, this.user.id, {
                    type: type,
                    created: new Date()
                });
            }
        },
    },
}