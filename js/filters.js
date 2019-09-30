Vue.filter('fromNow', function(value, fallback) {
    if (value) {
        return moment(value).fromNow();
    }
});

Vue.filter('fallback', function(value, fallback) {
    return value ? value : fallback;
});