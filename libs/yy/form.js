define(function(require) {
    var yy = require('./yy');
    var utils = yy.getUtils();
    var self = {};
    self.parameters = [];
    self.create = function(component, parameters) {
        var extend = {};
        component._extend = extend;
        component._utils = utils;
        extend.$fields = {};
        extend.$files = {};
        extend.lastData = {};
        //查找输入项
        var $fields = component.$this.children('input,textarea');
        $fields.each(function() {
            var $this = $(this);
            var name = $this.attr('name');
            if (name) {
                var type = $this.attr('type');
                if (type === 'file') {
                    extend.$files[name] = $this;
                } else {
                    extend.$fields[name] = $this;
                }
            }
        });
        component.getFile = function(name) {
            var file;
            var $file = this._extend.$files[name];
            if ($file) {
                var value = $file.val();
                if (value) {
                    file = $file[0].files[0];
                }
            }
            return file;
        };
        //
        component.getData = function() {
            var $fields = this._extend.$fields;
            var data = {};
            var $field;
            var value;
            for (var name in $fields) {
                $field = $fields[name];
                value = $field.val();
                value = this._utils.trim(value);
                data[name] = value;
            }
            return data;
        };
        //
        component.loadData = function(data) {
            var $fields = this._extend.$fields;
            var value;
            for (var name in $fields) {
                value = data[name];
                if (value || value === '' || value === 0) {
                    $fields[name].val(value);
                }
            }
        };
        //
        yy.clear = function() {
            var $fields = this._extend.$fields;
            for (var name in $fields) {
                $fields[name].val('');
            }
            var $files = this._extend.$files;
            for (var name in $files) {
                $files[name].val('');
            }
        };
        return component;
    };
    return self;
});


