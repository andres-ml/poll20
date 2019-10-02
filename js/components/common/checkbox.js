export default {
    template: /*html*/`
        <div class="field">
            <input class="is-checkradio is-info" :id="id" type="checkbox" :checked="isChecked" @change="change">
            <label :for="id">
                <slot/>
            </label>
        </div>
    `,
    props: ['id', 'checked', 'value'],
    computed: {
        isChecked() {
            return this.checked.includes(this.value);
        }
    },
    model: {
        prop: "checked",
        event: "change"
    },
    methods: {
        change() {
            const checked = this.checked.slice();
            const found = checked.indexOf(this.value);
            if (found !== -1) {
                checked.splice(found, 1);
            }
            else {
                checked.push(this.value);
            }
            this.$emit("change", checked);
        }
    }
}