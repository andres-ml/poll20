import './global.js';
import router from './routes.js';

const data = {

};

new Vue({
    el: '#app',
    router,
    data,
    template: /*html*/`
        <div>
            <base-layout>
                <router-view/>
            </base-layout>
        </div>
    `,
});