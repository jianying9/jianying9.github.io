define(function(require) {
    var yy = require('./yy');
    var self = {};
    self.parameters = [];
    self.create = function(component, parameters) {
        component._extend = {};
        component.getContext = function(key) {
            return this._extend[key];
        };
        
        component.setContext = function(obj) {
            for (var name in obj) {
                this._extend[name] = obj[name];
            }
        };
        return component;
    };
    var _components = yy.getComponents();
    //模块加载moduleLoader
    self.loadModule = function(loaderId, moduleId, callback) {
        if (!loaderId) {
            loaderId = _components.getRoot().id;
        }
        var component = _components.findByKey(loaderId, moduleId);
        if (component) {
            if (callback) {
                callback(component);
            }
        } else {
            require([moduleId], function(module) {
                var htmlUrl = 'text!' + moduleId + '.html';
                require([htmlUrl], function(html) {
                    var loader = _components.findById(loaderId);
                    loader.$this.append(html);
                    var $this = $('#' + moduleId);
                    var component = _components.create({
                        loaderId: loader.id,
                        type: 'module',
                        $this: $this,
                        parent: loader
                    });
                    if (module.init) {
                        module.init(component);
                    }
                    if (callback) {
                        callback(component);
                    }
                });
            });
        }
    };
    return self;
});