import Vue from 'https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.esm.browser.min.js'
import Header from './components/header.js'
import About from './components/about.js'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/about',
            component: About,
            children: [
                {
                    path: '',
                    component: Header,
                    name: "About Us Page",
                },
                {
                    path: '*',
                    redirect: '/about/main'
                },
            ]
        },
        {
            path: '*',
            redirect: '/about'
        },
    ]
});

new Vue({
    el: '#app',
    router,
    data: {},
    template: `
        <div>
            <top></top>
            All content will appear below the horizontal line.
            <hr>
            <router-view></router-view>
        </div>
    `,
    components: {
        'top': Header
    },
});