
define(function() {
    var self = {};
    //模块解析顺序
    model = {};
    model.skip = ['skip', 'form', 'button', 'panel'];
    model.module = ['skip', 'form', 'button', 'panel'];
    model.form = ['button'];
    model.button = [];
    model.panel = ['skip', 'form', 'button', 'panel'];
    //
    self.model = model;
    return self;
});


