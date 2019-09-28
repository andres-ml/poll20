import Storage from './lib/storage.js'
import { randomString } from './lib/utils.js';

window.Storage = Storage;

export default {
    data: {
        rooms: [],
        user: {
            id: randomString(),
        }
    },
    load: async function() {
        const state = await Storage.get('state');
        if (state === null) {
            state = this.data;
        }
        return state;
    },
    save: async function(data) {
        await Storage.set('state', data);
        return data;
    },
    reset: async function() {
        this.save(this.data);
    }
}