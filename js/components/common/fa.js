export default {
    template: /*html*/`
    <span class="icon" :class="modifiers">
        <i class="fa" :class="\'fa-\' + icon"></i>
    </span>
    `,
    props: ['icon', 'modifiers'],
}