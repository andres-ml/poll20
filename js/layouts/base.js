import Top from '../components/top.js'

export default {
    template: /*html*/`
        <div>
            <top></top>
            <hr>
            <slot/>
        </div>
    `,
    components: {
        'top': Top,
    },
    props: ['title']
}