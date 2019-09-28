export default {
    template: /*html*/`
        <div class="field">
            <input class="input" :type="type || 'text'" :placeholder="placeholder">
            <slot/>
        </div>
    `,
    props: ['type', 'placeholder']
}