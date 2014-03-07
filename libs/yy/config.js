
define(function() {
    var self = {};
    //模块解析顺序
    model = {};
    model.skip = ['skip', 'form', 'button', 'panel', 'label'];
    model.module = ['skip', 'form', 'button', 'panel', 'label'];
    model.form = ['skip', 'button', 'label'];
    model.button = [];
    model.label = [];
    model.panel = ['skip', 'form', 'button', 'panel', 'label'];
    //
    self.model = model;
    return self;
});


