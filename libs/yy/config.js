
define(function() {
    var self = {};
    //模块解析顺序
    model = {};
    model.skip = ['skip', 'form', 'button'];
    model.module = ['skip', 'form', 'button'];
    model.form = ['button'];
    model.button = [];
    //
    self.model = model;
    return self;
});


