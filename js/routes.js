import Rooms from './pages/rooms.js'
import Room from './pages/room.js'
import RoomCreate from './pages/create.js'
import RoomJoin from './pages/join.js'
import RoomPoll from './pages/room/poll.js'
import RoomHistory from './pages/room/history.js'
import RoomSettings from './pages/room/settings.js'
import Tools from './pages/room/tools.js'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/rooms',
            component: Rooms,
            name: "rooms",
        },
        {
            path: '/create',
            component: RoomCreate,
            name: 'room-create'
        },
        {
            path: '/join/:id/:userId?',
            component: RoomJoin,
            name: 'room-join'
        },
        {
            path: '/room/:id',
            component: Room,
            meta: {
                layout: 'empty'
            },
            children: [
                {
                    path: '',
                    component: RoomPoll,
                    name: 'room-poll',
                    meta: {
                        icon: 'chart-pie',
                        name: 'Poll'
                    }
                },
                {
                    path: 'history',
                    component: RoomHistory,
                    name: 'room-history',
                    meta: {
                        icon: 'chart-bar',
                        name: 'History'
                    }
                },
                {
                    path: 'tools',
                    component: Tools,
                    name: 'tools',
                    meta: {
                        icon: 'dice',
                        name: 'Tools'
                    }
                },
                {
                    path: 'settings',
                    component: RoomSettings,
                    name: 'room-settings',
                    meta: {
                        icon: 'cog',
                        name: 'Settings'
                    }
                },
            ]
        },
        {
            path: '*',
            redirect: '/rooms'
        },
    ]
});

export default router;