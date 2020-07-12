import { randomString } from '../lib/utils.js'
import ToolOptions from './tool-options.js'
import FormGroup from './form-group.js'

export default {
    components: {
        ToolOptions
    },
    template: /*html*/`
        <tool-options
            :editing="editing"
            @remove="$emit('remove')"
        >
            <template>
                <button class="button is-link is-fullwidth" @click="perform">
                    <span v-if="justReset">Done!</span>
                    <span v-else>Perform {{ value.name }}</span>
                </button>
            </template>
            <template #options>
                <form-group label="Reset name">
                    <input
                        v-model="value.name"
                        type="text"
                        class="input"
                        @input="$emit('input', value)"
                    />
                </form-group>
            </template>
        </tool-options>
    `,
    data() {
        return {
            editing: this.value.name === '',
            justReset: false,
        }
    },
    props: {
        value: {
            type: Object,
            default: () => ({
                name: '',
                id: randomString()
            })
        }
    },
    methods: {
        perform() {
            this.$emit('reset')
            this.justReset = true
            setTimeout(() => {
                this.justReset = false
            }, 1000)
        }
    }
}