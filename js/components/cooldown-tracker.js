import CooldownBar from './cooldown-bar.js'
import CooldownReset from './cooldown-reset.js'

export default {
    components: {
        CooldownBar,
        CooldownReset,
    },
    template: /*html*/`
        <div class="tool">
            <label class="label"><fa icon="hourglass-half"/> Cooldown tracker</label>
            <div class="cooldowns">
                <cooldown-bar
                    v-for="(cooldown, index) in cooldowns"
                    ref="cooldowns"
                    :key="index"
                    :resets="resets"
                    v-model="cooldowns[index]"
                    @input="(value) => cooldowns[index] = value"
                    @remove="remove('cooldowns', index)"
                />
            </div>
            <button class="button is-fullwidth is-transparent" @click="add('cooldowns')">
                New cooldown
            </button>
            <hr>
            <div class="resets">
                <cooldown-reset
                    v-for="(reset, index) in resets"
                    v-model="resets[index]"
                    :key="index"
                    @input="(value) => resets[index] = value"
                    @reset="performReset(index)"
                    @remove="remove('resets', index)"
                />
            </div>
            <button class="button is-fullwidth is-transparent" @click="add('resets')">
                New reset
            </button>
        </div>
    `,
    data() {
        return store.get('cooldowns') || {
            cooldowns: [],
            resets: [
                {
                    id: 'short-rest',
                    name: 'Short rest',
                },
                {
                    id: 'long-rest',
                    name: 'Long rest',
                },
            ]
        }
    },
    methods: {
        add(type) {
            this.$data[type].push(undefined)
        },
        remove(type, index) {
            this.$data[type].splice(index, 1)
        },
        performReset(index) {
            this.$refs.cooldowns.forEach(cooldown => cooldown.reset(this.resets[index]))
        }
    },
    watch: {
        $data: {
            deep: true,
            handler: function() {
                store.set('cooldowns', {
                    cooldowns: this.cooldowns.filter(R.identity),
                    resets: this.resets.filter(R.identity),
                })
            },
        }
    }
}