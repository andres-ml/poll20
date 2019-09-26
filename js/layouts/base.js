import Top from '../components/top.js'
import Foot from '../components/foot.js'

export default {
    template: /*html*/`
        <div>
            <top></top>
            <hr>
            <slot/>
            <foot/>
        </div>
    `,
    components: {
        'top': Top,
        'foot': Foot,
    },
}