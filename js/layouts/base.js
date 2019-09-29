import Top from '../components/top.js'
import Foot from '../components/foot.js'

export default {
    template: /*html*/`
        <div>
            <top></top>
            <hr style="margin: 0px">
            <div class="">
                <slot/>
            </div>
            <foot/>
        </div>
    `,
    components: {
        'top': Top,
        'foot': Foot,
    },
}