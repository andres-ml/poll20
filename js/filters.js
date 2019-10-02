Vue.filter('fromNow', function(value, granularity) {
    if (value) {
        return moment(value).fromNow();
    }
});

Vue.filter('daysAgo', function(value, granularity) {
    if (value) {
        return moment().diff(moment(value), 'days') + 'd';
    }
});

Vue.filter('fallback', function(value, fallback) {
    return value ? value : fallback;
});

Vue.filter('length', function(value) {
    return 'length' in value ? value.length : value;
});

Vue.filter('pluralize', function(value, variable, plural = undefined) {
    if (variable.length > 1) {
        return plural ? plural : (value + 's');
    }
    return value;
});