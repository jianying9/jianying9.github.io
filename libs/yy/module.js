define(function(require) {
    var yy = require('./yy');
    var self = {};
    self.parameters = [];
    self.create = function(component, parameters) {
        return component;
    };
    var _components = yy.getComponents();
    //模块加载moduleLoader
    self.loadModule = function(loaderId, moduleId, callback) {
        if (!loaderId) {
            loaderId = _components.getRoot().id;
        }
        var module = _components.findByKey(loaderId, moduleId);
        if (module) {
            if (callback) {
                callback(module);
            }
        } else {
            require([moduleId], function() {
                var htmlUrl = 'text!' + moduleId + '.html';
                require([htmlUrl], function(html) {
                    var loader = _components.findById(loaderId);
                    loader.$this.append(html);
                    var $this = $('#' + moduleId);
                    var newModule = _components.create({
                        loaderId: loader.id,
                        type: 'module',
                        $this: $this,
                        parent: loader
                    });
                    if (callback) {
                        callback(newModule);
                    }
                });
            });
        }
    };
    return self;
});


