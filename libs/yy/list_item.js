define(function(require) {
    require('./yy');
    var self = {};
    self.parameters = [];
    self.create = function(component, parameters) {
        component.getData = function() {
            var data = this.parent._extend.data;
            return data[this.key];
        };
        component.selected = function() {
            for (var id in this.parent.children) {
                this.parent.children[id].$this.removeClass('selected');
            }
            this.$this.addClass('selected');
        };
        return component;
    };
    return self;
});


