export default {
    get: async function(key) {
        return await JSON.parse(localStorage.getItem(key) || '{}');
    },
    set: async function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        return data;
    },
    merge: async function(key, data) {
        const state = await this.get(key);
        _.merge(state, data);
        return this.set(key, state);
    }
}