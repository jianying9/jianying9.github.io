define(function(require) {
    var yy = require('./yy');
    var utils = yy.getUtils();
    var self = {};
    self.parameters = [];
    self.create = function(component, parameters) {
        var _extend = {};
        component._extend = _extend;
        component._utils = utils;
        _extend.$fields = {};
        _extend.$files = {};
        _extend.lastData = {};
        //查找输入项
        var $fields = component.$this.children('input,textarea');
        $fields.each(function() {
            var $this = $(this);
            var name = $this.attr('name');
            if (name) {
                var type = $this.attr('type');
                if (type === 'file') {
                    _extend.$files[name] = $this;
                } else {
                    _extend.$fields[name] = $this;
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
        component.setData = function(name, value) {
            var $fields = this._extend.$fields;
            var $field = $fields[name];
            if ($field) {
                $field.val(value);
            }
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
        component.clear = function() {
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


