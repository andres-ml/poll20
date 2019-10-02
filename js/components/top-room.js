export default {
    template: /*html*/`
        <div class="top">
            <div class="centered-items">
                <router-link :to="{name: 'rooms'}" class="logo" style="flex: 0 0 75px">
                    <img src="img/logo-2.png">
                </router-link>
                <div style="min-width: 150px">
                    <h1 class="title">{{ room ? room.name : '' }}</h1>
                </div>
            </div>
        </div>
    `,
    props: ['room']
}