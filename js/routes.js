import Rooms from './pages/rooms.js'
import Room from './pages/room.js'
import RoomCreate from './pages/rooms/create.js'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/rooms',
            component: Rooms,
            name: "rooms",
        },
        {
            path: '/rooms/create',
            component: RoomCreate,
            name: 'room-create'
        },
        {
            path: '/room/:id',
            component: Room,
            name: "room",
        },
        {
            path: '*',
            redirect: '/rooms'
        },
    ]
});

export default router;