import './global.js';
import router from './routes.js';
import state from './state.js'
import BaseLayout from './layouts/base.js'
import EmptyLayout from './layouts/empty.js'

const data = {
    state: state.load(),
};

const defaultLayout = 'base';

new Vue({
    el: '#app',
    router,
    data,
    template: /*html*/`
        <div>
            <component :is="layout + '-layout'">
                <router-view :state="state"/>
            </component>
        </div>
    `,
    computed: {
        layout() {
            for (const route of this.$route.matched.slice().reverse()) {
                const routeLayout = R.get('meta.layout', route);
                if (routeLayout) {
                    return routeLayout;
                }
            }
            return defaultLayout;
        }
    },
    components: {
        'base-layout': BaseLayout,
        'empty-layout': EmptyLayout,
    },
    watch: {
        state: {
            handler: function() {
                state.save(this.state);
            },
            deep: true,
        },
    }
});