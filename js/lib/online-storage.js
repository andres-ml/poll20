const endpoint = "https://jsonstorage.net/api/items/";

export default {
    load: async function(key) {
        return axios.get(endpoint + key).then(response => response.data);
    },
    save: async function(key, data) {
        return axios.put(endpoint + key, data).then(_ => data);
    },
}