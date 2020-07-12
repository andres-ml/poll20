import FormGroup from './form-group.js'
import ToolOptions from './tool-options.js'

export default {
    components: {
        FormGroup,
        ToolOptions,
    },
    template: /*html*/`
        <div class="tool">
            <tool-options
                :editing="editing"
                @remove="$emit('remove')"
            >
                <template>
                    <h1 class="cooldown-name">
                        {{ value.name }} &nbsp;&mdash;&nbsp; {{ value.remainingUses}} / {{ value.maxUses }}
                    </h1>
                </template>
                <template #options>
                    <form-group label="Cooldown name">
                        <input
                            v-model="value.name"
                            type="text"
                            class="input"
                            placeholder="Your cooldown (e.g. 'Monk Ki')"
                        >
                    </form-group>
                    <form-group label="Max uses per reset">
                        <input
                            v-model.number="value.maxUses"
                            type="number"
                            class="input"
                            placeholder="1"
                        >
                    </form-group>
                    <form-group label="Auto-reset on:">
                        <label 
                            v-for="reset in resets" :key="resets.id"
                            class="checkbox"
                            style="margin: 5px 0; display: block;"
                        >
                            <input
                                :value="reset.id"
                                v-model="value.handlers"
                                type="checkbox"
                            >
                            {{ reset.name }}
                        </span>
                        <span v-if="!resets.length">
                            You haven't defined any resets (e.g. "Short rest", "Long rest")
                        </span>
                    </form-group>
                </template>
            </tool-options>
            <div class="cooldown-bar">
                <div
                    v-for="(slot, index) in slots" :key="index"
                    class="cooldown-slot"
                    @click="use(index)"
                >
                    <div
                        :class="{ active: slot.active }"
                        class="cooldown-status"
                    />
                </div>
            </div>
        </div>
    `,
    props: {
        resets: {
            type: Array,
        },
        value: {
            type: Object,
            default: () => ({
                name: '',
                remainingUses: 1,
                maxUses: 1,
                handlers: [],
            })
        }
    },
    data() {
        return {
            editing: this.value.name === '',
        }
    },
    computed: {
        slots() {
            return R.range(0, this.value.maxUses)
                .map(index => {
                    return {
                        active: index < this.value.remainingUses
                    }
                })
        }
    },
    methods: {
        use(index) {
            if (index + 1 === this.value.remainingUses) {
                index -= 1
            }
            this.$emit('input', {
                ...this.value,
                remainingUses: index + 1
            })
        },
        reset(reset) {
            if (this.value.handlers.indexOf(reset.id) !== -1) {
                this.value.remainingUses = this.value.maxUses
            }
        }
    },
    watch: {
        value: {
            deep: true,
            handler(value) {
                this.$emit('input', value)
            }
        }
    }
}