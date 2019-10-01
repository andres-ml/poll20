import './global.js';
import router from './routes.js';
import state from './state.js'

const data = {
    state: state.load(),
};

window.resetState = () => state.reset();

new Vue({
    el: '#app',
    router,
    data,
    template: /*html*/`
        <div>
            <base-layout>
                <router-view :state="state"/>
            </base-layout>
        </div>
    `,
    watch: {
        state: {
            handler: function() {
                state.save(this.state);
            },
            deep: true,
        },
    }
});