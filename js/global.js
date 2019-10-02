import Fa from './components/common/fa.js';
import Loading from './components/common/loading.js';
import InputItem from './components/common/input-item.js';
import Base from './layouts/base.js';
import Checkbox from './components/common/checkbox.js';
import Notification from './components/common/notification.js';
import './filters.js';

Vue.component('fa', Fa);
Vue.component('loading', Loading)
Vue.component('input-item', InputItem);
Vue.component('base-layout', Base);
Vue.component('checkbox', Checkbox);
Vue.component('notification', Notification);

Vue.mixin({
    methods: {
        /**
         * Sets the specified value on item[property] for the specified amount of time.
         * Example usage:
         * 
         * this.flashSet(this, 'notification', 'Action successful!')
         * 
         * https://vuejs.org/v2/api/#Vue-set
         * 
         * @param {*} item 
         * @param {*} property 
         * @param {*} value 
         * @param {*} emptyValue 
         * @param {*} timeoutInSeconds 
         */
        flashSet: function(item, property, value, emptyValue = '', timeoutInSeconds = 5) {
            this.$set(item, property, value);
            setTimeout(() => this.$set(item, property, emptyValue), timeoutInSeconds * 1000);
        },
        loadWhile: function(callback) {
            const result = callback.apply(this, arguments);
            const target = event.target;
            if (result instanceof Promise && target.classList.contains('button')) {
                target.classList.add('is-loading');
                result.finally(() => target.classList.remove('is-loading'));
            }
            return result;
        }
    }
})