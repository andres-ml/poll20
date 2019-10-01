export default {
    template: /*html*/`
        <div class="top">
            <div class="centered-items">
                <router-link :to="{name: 'rooms'}" class="logo" style="flex: 0 0 75px">
                    <img src="img/logo-2.png">
                </router-link>
                <div style="">
                    <h1 class="title">Poll20</h1>
                    <h2 class="subtitle">Board game voting and statistics for groups of friends</h2>
                </div>
            </div>
        </div>
    `
}