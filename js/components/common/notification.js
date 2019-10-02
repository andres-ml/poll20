// classList instead of vue transitions since vue transitions make it wonky, even when
// defining a base empty child and accounting for margins.

export default {
    template: /*html*/`
        <div class="notification is-collapsible" :class="classList">
            <slot/>
        </div>
    `,
    computed: {
        classList() {
            const classes = ['is-' + this.type];
            if (!this.if) {
                classes.push('is-collapsed')
            }
            return classes;
        }
    },
    props: {
        type: {
            default: 'info',
        },
        if: Boolean,
    }
}