import './global.js';
import router from './routes.js';
import state from './state.js'

const data = {
    loaded: false,
    state: null
};

window.resetState = () => state.reset();

new Vue({
    el: '#app',
    router,
    data,
    template: /*html*/`
        <div>
            <base-layout>
                <router-view v-if="loaded" :state="state"/>
                <loading v-else/>
            </base-layout>
        </div>
    `,
    created: function() {
        state.load().then((result) => {
            this.state = result;
            this.loaded = true;
        });
    },
    watch: {
        state: {
            handler: function() {
                if (this.syncing) {
                    this.syncing = false;
                    return;
                }
                
                state.save(this.state)
                    .then((result) => {
                        // update potential updates found when updating
                        if (!_.isEqual(this.state, result)) {
                            this.syncing = true;
                            this.state = result;
                        }
                    })
            },
            deep: true,
        },
    }
});