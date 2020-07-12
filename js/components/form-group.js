export default {
    template: /*html*/`
        <div style="display: flex" style="margin-bottom: 5px">
            <label style="flex: 0 0 100px">{{ label }}</label>
            <div style="flex: 1">
                <slot/>
            </div>
        </div>
    `,
    props: {
        label: String
    }
}