import About from './components/about.js'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/about',
            component: About,
            name: "About Us Page",
        },
        {
            path: '*',
            redirect: '/about'
        },
    ]
});

export default router;