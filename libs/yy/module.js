define(function(require) {
    var self = {};
    self.parameters = [];
    self.create = function(component, parameters) {
        component.show = function() {
            this.$this.show();
        };
        return component;
    };
    return self;
});


