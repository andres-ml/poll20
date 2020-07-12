import FormGroup from './form-group.js'

export default {
    components: {
        FormGroup,
    },
    template: /*html*/`
        <div style="display: flex; align-items: stretch; margin-bottom: 10px">
            <div style="flex: 1; margin-right: 10px">
                <div class v-if="localEditing">
                    <slot name="options"/>
                    <form-group label="Delete item">
                        <button
                            class="button is-fullwidth"
                            :class="'is-' + (confirmingDeletion ? 'danger' : 'light')"
                            @click="confirmingDeletion ? $emit('remove') : (confirmingDeletion = true)"
                        >
                            <span v-if="!confirmingDeletion">Delete item</span>
                            <span v-else>Press again to delete this item</span>
                        </button>
                    </form-group>
                </div>
                <div v-else>
                    <slot name="default"/>
                </div>
            </div>
            <button
                class="button is-light" 
                style="flex: 0 0 50px; height: initial"
                @click="localEditing = !localEditing"
            >
                <fa icon="edit"/>
            </button>
        </div>
    `,
    props: {
        editing: Boolean,
    },
    data() {
        return {
            localEditing: this.editing,
            confirmingDeletion: false,
        }
    },
    watch: {
        localEditing() {
            this.confirmingDeletion = false
        }
    }
}