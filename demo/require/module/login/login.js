define(function(require) {
    var self = {};
    self.create = function(component, parameters) {
        component.show = function() {
            this.$this.show();
        };
        return component;
    };
    return self;
});