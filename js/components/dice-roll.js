import DieRoll from './die-roll.js'

export default {
    components: {
        DieRoll
    },
    template: /*html*/`
        <div class="tool">
            <label class="label"><fa icon="dice"/> Dice rolling</label>
            <div class="presets">
                <die-roll
                    v-for="(preset, index) in presets"
                    v-model="presets[index]"
                    :key="index"
                    @input="(value) => presets[index] = value"
                    @remove="removePreset(index)"
                />
            </div>
            <hr>
            <button class="button is-fullwidth is-link" @click="addPreset">
                New preset
            </button>
        </div>
    `,
    data() {
        return {
            presets: (store.get('dice-roll-presets') || [])
                .filter(p => p !== null)
        }
    },
    methods: {
        addPreset() {
            this.presets.push(undefined)
        },
        removePreset(index) {
            this.presets.splice(index)
        }
    },
    watch: {
        presets() {
            store.set('dice-roll-presets', this.presets)
        }
    }
}