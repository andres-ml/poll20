import ToolOptions from './tool-options.js'
import FormGroup from './form-group.js'

export default {
    components: {
        FormGroup,
        ToolOptions,
    },
    filters: {
        signed(n) {
            return (n > 0 ? '+' : '') + n.toString()
        }
    },
    template: /*html*/`
        <div class="tool">
            <tool-options
                :editing="editing"
                @remove="$emit('remove')"
            >
                <template>
                    <button
                        class="button is-fullwidth is-outlined"
                        :class="(loading && isFullRoll) ? 'is-loading' : ''"
                        style="font-size: 20px"
                        @click="roll(undefined)"
                    >
                        <fa icon="dice" style="margin-right: 10px"/>
                        Roll for {{ value.name }}
                        <span v-if="value.modifier" style="opacity: 0.7; margin-left: 5px">({{ value.modifier | signed }})</span>
                    </button>
                </template>
                <template #options>
                    <form-group label="Preset name">
                        <input
                            v-model="value.name"
                            type="text"
                            class="input"
                            placeholder="Basic attack"
                        >
                    </form-group>
                    <form-group label="Dice list">
                        <input
                            v-model="value.dice"
                            type="text"
                            class="input"
                            placeholder="20"
                        >
                    </form-group>
                    <form-group label="Modifier">
                        <input
                            v-model.number="value.modifier"
                            type="number"
                            class="input"
                            placeholder="E.g. +3"
                        >
                    </form-group>
                </template>
            </tool-options>
            <div class="dice-summary">
                <span
                    v-for="(sides, index) in dice" :key="index"
                    class="dice"
                    :class="diceClass[index]"
                    @click="roll(index)"
                >
                    <div
                        v-if="index in rolling"
                        class="roll"
                    >
                        <fa v-if="rolling[index]" icon="circle-notch fa-spin"/>
                        <span v-else class="roll-result">
                            <fa v-if="diceIcon[index]" :icon="diceIcon[index]"/>
                            {{ result[index] }}
                        </span>
                    </div>
                    <div class="sides">
                        d{{ sides }}
                    </div>
                </span>
                <span
                    v-if="isFullRoll && (dice.length > 1 || value.modifier)"
                    class="dice roll-final"
                    :style="fullRollStyle"
                    style="flex: 1 1 100%"
                    @click="roll(undefined)"
                >
                    <div class="roll">
                        <fa v-if="loading" icon="circle-notch fa-spin"/>
                        <span v-else class="roll-result">
                            {{ rollResult + value.modifier }}
                        </span>
                    </div>
                </span>
                <div v-if="!dice.length">
                    Define your dice by writing a list of numbers, e.g. for two d6 and one d8, write "6,6,8"
                </div>
            </div>
        </div>
    `,
    props: {
        value: {
            type: Object,
            default: () => ({
                name: '',
                dice: '20',
                modifier: '',
            })
        }
    },
    data() {
        return {
            rolling: [],
            result: [],
            editing: this.value.name === '',
        }
    },
    computed: {
        dice() {
            const numbers = this.value.dice.match(/\d+/g) || []
            return R.compose(
                R.sortBy(R.identity),
                R.map(R.unary(parseInt)),
                R.filter(n => n > 1),
                Array.from,
            )(numbers)
        },
        loading() {
            return Object.values(this.rolling).some(R.identity)
        },
        rollResult() {
            return R.sum(Object.values(this.result))
        },
        rollRange() {
            const indices = Object.keys(this.result)
            return [
                indices.length,
                R.sum(indices.map(index => this.dice[index]))
            ]
        },
        isFullRoll() {
            return Object.keys(this.result).length === this.dice.length && this.dice.length > 0
        },
        fullRollStyle() {
            const color1 = 'rgb(166, 222, 255)'
            const color2 = '#55a7ff'
            const threshold = this.loading ? 0 : ((this.rollResult + this.value.modifier) / (this.rollRange[1] + this.value.modifier))
            const gradientThreshold = (1 - threshold) * 100
            return {
                background: `linear-gradient(295deg, ${color1} ${gradientThreshold}%, ${color2} ${gradientThreshold}%)`
            }
        },
        diceClass() {
            return this.dice.map((sides, index) => {
                if (!(index in this.result)) {
                    return ''
                }
                else if (this.result[index] === 1) {
                    return 'roll-critical-failure'
                }
                else if (this.result[index] === sides) {
                    return 'roll-critical-success'
                }
                else {
                    return 'roll-regular'
                }
            })
        },
        diceIcon() {
            return this.dice.map((sides, index) => {
                if (this.result[index] === 1) {
                    return 'skull-crossbones'
                }
                else if (this.result[index] === sides) {
                    return 'crown'
                }
                return undefined
            })
        },
    },
    methods: {
        roll(index) {
            const [from, to] = index === undefined ? [0, this.dice.length] : [index, index + 1]
            this.rolling = R.mergeRight(this.rolling, R.fromPairs(R.range(from, to).map(i => [i, true])))
            this.result = R.mergeRight(this.result, R.fromPairs(R.range(from, to).map(i => [i, 0])))
            const roll = (index, timeout = 100) => {
                setTimeout(() => {
                    if (index < to) {
                        this.$set(this.result, index, Math.floor(Math.random() * this.dice[index]) + 1)
                        this.$set(this.rolling, index, false)
                        roll(index + 1)
                    }
                }, timeout)
            }
            roll(from, 200)
        },
    },
    watch: {
        value: {
            deep: true,
            handler(value) {
                this.rolling = {}
                this.result = {}
                this.$emit('input', value)
            }
        }
    }
}