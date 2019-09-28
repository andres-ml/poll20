/**
 * Add this mixin to an element to automatically focus an input on element mount.
 * If refName is specified, this.$refs[refName] will be used; otherwise, the main element this.$el.
 * If the element is an input, it will be focused; otherwise, the first child input will be focused, if any.
 * 
 * @param string|null refName 
 */
export function autoFocus(refName = null) {
    return {
        mounted: function() {
            let element = this.$el;
            
            if (refName && refName in this.$refs) {
                element = this.$refs[refName];
                if ('$el' in element) {
                    element = element.$el;
                }
            }
            
            if (element.tagName.toLowerCase() !== 'input') {
                element = element.querySelector('input');
            }

            if (element) {
                element.focus();
            }
        },
    }
}