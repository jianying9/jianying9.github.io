/**
 * yy核心库
 */

define(function(require) {
//require用于依赖加载
//localRequire用于动态加载
    require('jquery');
    require('jquery.mousewheel');
    var self = {};
    //浏览器信息
    var _browser = {};
    _browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
    _browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
    _browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
    _browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
    //计数器
    var _index = {
        currentIndex: new Date().getTime(),
        zIndex: 20,
        nextIndex: function() {
            this.currentIndex++;
            return this.currentIndex.toString();
        },
        nextZIndex: function() {
            this.zIndex++;
            return this.zIndex.toString();
        }
    };
    self.getIndex = function() {
        return _index;
    };
    //context上下文对象
    var el = document.compatMode === "CSS1Compat" ? document.documentElement : document.body;
    var _context = {
        httpServer: 'http://127.0.0.1/service.io',
        webSocketServer: 'ws://127.0.0.1/service.io',
        logLevel: 4,
        modulePath: 'module',
        bodyWidth: el.clientWidth,
        bodyHeight: el.clientHeight,
        version: 1
    };
    var $body = $('body');
    $body.css({height: _context.bodyHeight});
    self.setConfig = function(config) {
        for (var name in config) {
            _context[name] = config[name];
        }
    };
    self.getConfig = function(name) {
        return _context[name];
    };
    //logger日志对象
    var _logger = {};
    if (_browser.mozilla || _browser.webkit) {
        _logger._loggerImpl = console;
        _logger._context = _context;
        _logger.debug = function(msg) {
            if (this._loggerImpl && this._context.logLevel >= 4) {
                this._loggerImpl.debug('DEBUG:' + msg);
            }
        };
        _logger.info = function(msg) {
            if (this._loggerImpl && this._context.logLevel >= 3) {
                this._loggerImpl.debug('INFO:' + msg);
            }
        };
        _logger.warn = function(msg) {
            if (this._loggerImpl && this._context.logLevel >= 2) {
                this._loggerImpl.debug('WARN:' + msg);
            }
        };
        _logger.error = function(msg) {
            if (this._loggerImpl && this._context.logLevel >= 2) {
                this._loggerImpl.debug('ERROR:' + msg);
            }
        };
    } else {
        _logger.debug = function(msg) {
        };
        _logger.info = function(msg) {
        };
        _logger.warn = function(msg) {
        };
        _logger.error = function(msg) {
        };
    }
    //session对象
    var _session = {};
    self.setSession = function(config) {
        for (var name in config) {
            _session[name] = config[name];
        }
    };
    self.getSession = function(name) {
        return _session[name];
    };
    self.clearSession = function() {
        for (var name in _session) {
            delete _session[name];
        }
    };
    //根对象
    var rootId = _index.nextIndex();
    $body.attr({
        id: rootId,
        onselectstart: "return false"
    });
    var _root = {
        type: 'root',
        id: rootId,
        $this: $body,
        children: {},
        extend: {}
    };
    //utils创建工具对象
    var _utils = {
        attr: function(name, $target, defValue) {
            var value = $target.attr(name);
            if (!value) {
                value = defValue;
            }
            return value;
        },
        trim: function(value) {
            return $.trim(value);
        },
        shortDate: function(thisDateStr, nowDate) {
            var result;
            thisDateStr = thisDateStr.replace(/-/g, '/');
            var thisDate = new Date(Date.parse(thisDateStr));
            var dYear = nowDate.getFullYear() - thisDate.getFullYear();
            if (dYear > 0) {
                result = dYear + '年前';
            } else {
                var dMonth = nowDate.getMonth() - thisDate.getMonth();
                if (dMonth > 0) {
                    result = dMonth + '月前';
                } else {
                    var dDay = nowDate.getDate() - thisDate.getDate();
                    if (dDay > 0) {
                        result = dDay + '天前';
                    } else {
                        result = thisDateStr.split(' ')[1];
                    }
                }
            }
            return result;
        },
        initScroll: function(clientHeight, scrollHeight, component) {
            var _extend = component._extend;
            _extend.scrollHeight = scrollHeight;
            var sHeight = parseInt(Math.pow(clientHeight, 2) / scrollHeight);
            _extend.seed = (scrollHeight - clientHeight) / (scrollHeight - sHeight);
            _extend.sHeight = sHeight;
            _extend.$scroll.css({height: sHeight});
        },
        scrollTop: function(top, component) {
            var _extend = component._extend;
            var seed = _extend.seed;
            var scrollHeight = _extend.scrollHeight;
            var sHeight = _extend.sHeight;
            var newTop = parseInt(top / seed);
            if (newTop + sHeight > scrollHeight) {
                newTop = scrollHeight - sHeight;
            }
            _extend.$scroll.css({top: newTop});
        }
    };
    self.getUtils = function() {
        return _utils;
    };
    //创建事件管理对象
    var _event = {
        click: {},
        dbclick: {},
        mousedown: {},
        mouseup: {},
        mousemove: {},
        mousewheel: {},
        enter: {},
        bind: function(component, type, func) {
            if (this[type]) {
                this[type][component.id] = func;
            }
        },
        unbind: function(component, type) {
            var id = component.id;
            if (type) {
                var eventType = this[type];
                if (eventType) {
                    delete eventType[id];
                }
            } else {
                delete this.click[id];
                delete this.dbclick[id];
                delete this.mousedown[id];
                delete this.mouseup[id];
                delete this.mousemove[id];
                delete this.mousewheel[id];
                delete this.enter[id];
            }
        },
        getFunc: function(component, type) {
            var func;
            var id = component.id;
            if (this[type]) {
                func = this[type][id];
            }
            return func;
        }
    };
    self.getEvent = function() {
        return _event;
    };
    //message消息管理对象
    var _message = {
        actions: {},
        _logger: _logger,
        listen: function(component, actionName, func) {
            var action = this.actions[actionName];
            if (!action) {
                action = {};
                this.actions[actionName] = action;
            }
            action[component.id] = {
                target: component,
                func: func
            };
        },
        remove: function(component) {
            var id = component.id;
            var action;
            for (var actionName in this.actions) {
                action = this.actions[actionName];
                delete action[id];
            }
        },
        notify: function(msg) {
            var res = eval('(' + msg + ')');
            if (res.act) {
                var action = this.actions[res.act];
                if (action) {
                    var listener;
                    for (var id in action) {
                        listener = action[id];
                        listener.func(listener.target, res);
                    }
                }
            } else {
                this._logger.error('error message:' + msg);
            }
        }
    };


    if (window.MozWebSocket || window.WebSocket) {
        var Socket = "MozWebSocket" in window ? MozWebSocket : WebSocket;
//初始化websocket
        _message.send = function(msg) {
            var that = this;
            var msgText = '{';
            for (var name in msg) {
                msgText += '"' + name + '":"' + msg[name] + '",';
            }
            msgText = msgText.substr(0, msgText.length - 1);
            msgText += '}';
            if (that.webSocket && that.webSocket.readyState === 1) {
                that.webSocket.send(msgText);
                that.webSocket._logger.debug('sendMessage:' + msgText);
            } else {
                if (that.webSocket && that.webSocket.readyState !== 1) {
                    that.webSocket.close();
                    delete that.webSocket;
                }
                that.webSocket = new Socket(_context.webSocketServer);
                that.webSocket._server = _context.webSocketServer;
                that.webSocket._logger = _logger;
                that.webSocket._event = _event;
                that.webSocket.onopen = function(event) {
                    this._logger.debug('connect:' + this._server);
                    this.send(msgText);
                    this._logger.debug('sendMessage:' + msgText);
                };
                that.webSocket.onmessage = function(event) {
                    this._logger.debug('onMessage:' + event.data);
                    that.notify(event.data);
                };
                that.webSocket.onclose = function(event) {
                    delete that.webSocket;
                    this._logger.debug('close:' + this._server);
                };
                that.webSocket.onerror = function(event) {
                    delete that.webSocket;
                    this._logger.debug('error:' + this._server);
                };
            }
        };
    } else {
//初始化jsonp
        _message._server = _context.httpServer;
        _message.send = function(msg) {
            var that = this;
            $.getJSON(that._server + '?callback=?', msg, function(data) {
                that.notify(data);
            });
        };
    }
    self.getMessage = function() {
        return _message;
    };
    //components组建对象管理
    var _components = {
        _root: _root,
        _logger: _logger,
        _index: _index,
        _utils: _utils,
        _event: _event,
        _message: _message,
        getRoot: function() {
            return this._root;
        },
        findChildById: function(id, parent) {
            var result;
            var child;
            var children = this._root.children;
            if (parent) {
                children = parent.children;
            }
            for (var indexId in children) {
                child = children[indexId];
                if (indexId === id) {
                    result = child;
                    break;
                } else {
                    result = this.findChildById(id, child);
                    if (result) {
                        break;
                    }
                }
            }
            return result;
        },
        findChildByKey: function(key, parent) {
            var result;
            var child;
            var children = this._root.children;
            if (parent) {
                children = parent.children;
            }
            for (var indexId in children) {
                child = children[indexId];
                if (child.key === key) {
                    result = child;
                    break;
                } else {
                    result = this.findChildByKey(key, child);
                    if (result) {
                        break;
                    }
                }
            }
            return result;
        },
        findByKey: function(loaderId, key) {
            var result;
            //查找loader
            var loader;
            if (loaderId === this._root.id) {
                loader = this._root;
            } else {
                loader = this.findChildById(loaderId, _root);
            }
//查找目标
            if (loader) {
                if (loader.key === key) {
                    result = loader;
                } else {
                    result = this.findChildByKey(key, loader);
                }
                if (!result) {
                    this._logger.warn('can not find component by key:' + key + ' in loaderId:' + loaderId);
                }
            } else {
                this._logger.warn('can not find component by id:' + loaderId);
            }
            return result;
        },
        findById: function(id) {
            var result;
            if (id === this._root.id) {
                result = this._root;
            } else {
                result = this.findChildById(id, this._root);
                if (!result) {
                    this._logger.warn('can not find component by id:' + id);
                }
            }
            return result;
        },
        create: function(ctx) {
            var config = require('./config');
            var _components = this;
            var loaderId = ctx.loaderId;
            var parent = ctx.parent;
            if (ctx.type === 'skip') {
//遍历所有子控件
                var innerModels = config.model.skip;
                for (var index = 0; index < innerModels.length; index++) {
                    var type = innerModels[index];
                    var $child = ctx.$this.children('.' + type);
                    $child.each(function() {
                        _components.create({
                            loaderId: loaderId,
                            type: type,
                            $this: $(this),
                            parent: parent
                        });
                    });
                }
            } else {
                var key = ctx.$this.attr('id');
                var id = _components._index.nextIndex();
                var component = {
                    loaderId: loaderId,
                    id: id,
                    type: ctx.type,
                    $this: ctx.$this,
                    parent: parent,
                    key: key,
                    children: {}
                };
                component.$this.attr('id', id);
                component.parent.children[id] = component;
                var model = require('./' + ctx.type);
                //读取配置参数
                var parameters = {};
                var attrName, attrValue;
                for (var index = 0; index < model.parameters.length; index++) {
                    attrName = model.parameters[index];
                    attrValue = _components._utils.attr(attrName, component.$this);
                    config[attrName] = attrValue;
                }
//创建组件
                model.create(component, parameters);
                //组件固有方法
                component.show = function() {
                    this.$this.show();
                };
                component.hide = function() {
                    this.$this.hide();
                };
                component.isVisible = function() {
                    return this.$this.is(':visible');
                };
                component.removeChildren = function() {
                    var child;
                    for (var id in this.children) {
                        child = this.children[id];
                        child.remove();
                    }
                    this.children = {};
                };
                component.remove = function() {
                    //清除所有子节点
                    this.removeChildren();
                    _components._event.unbind(this);
                    _components._message.remove(this);
                    delete this.parent.children[this.id];
                    this.$this.remove();
                };
                //创建内部组件
                var innerModels = config.model[ctx.type];
                for (var index = 0; index < innerModels.length; index++) {
                    var type = innerModels[index];
                    var $child = ctx.$this.children('.' + type);
                    $child.each(function() {
                        _components.create({
                            loaderId: loaderId,
                            type: type,
                            $this: $(this),
                            parent: component
                        });
                    });
                }
                _components._logger.debug('create component finished.type:' + ctx.type + ' key:' + key + ' id:' + id);
                return component;
            }
        }
    };
    self.getComponents = function() {
        return _components;
    };
    //初始化事件响应
    _root.$this.click(function(event) {
        var target = event.target;
        while (target.id === '') {
            target = target.parentElement;
        }
        var targetId = target.id;
        var component = _components.findById(targetId);
        if (component) {
            var func = _event.click[component.id];
            if (func) {
                func(component, event);
            }
        }
    });
    _root.$this.dblclick(function(event) {
        var target = event.target;
        while (target.id === '') {
            target = target.parentElement;
        }
        var targetId = target.id;
        var component = _components.findById(targetId);
        if (component) {
            var func = _event.dbclick[component.id];
            if (func) {
                func(component, event);
            }
        }
    });
    _root.$this.mousedown(function(event) {
        var target = event.target;
        while (target.id === '') {
            target = target.parentElement;
        }
        var targetId = target.id;
        var component = _components.findById(targetId);
        if (component) {
            var func = _event.mousedown[component.id];
            if (func) {
                func(component, event);
            }
        }
    });
    _root.$this.mouseup(function(event) {
        var target = event.target;
        while (target.id === '') {
            target = target.parentElement;
        }
        var targetId = target.id;
        var component = _components.findById(targetId);
        if (component) {
            var func = _event.mouseup[component.id];
            if (func) {
                func(component, event);
            }
        }
    });
    _root.$this.mousewheel(function(event, delta, deltaX, deltaY) {
        var target = event.target;
        while (target.id === '') {
            target = target.parentElement;
        }
        var targetId = target.id;
        var component = _components.findById(targetId);
        if (component) {
            var func = _event.mousewheel[component.id];
            if (func) {
                func(component, event, delta, deltaX, deltaY);
            }
        }
    });
    _root.$this.keyup(function(event) {
        if (!event.ctrlKey) {
            var keyCode = event.keyCode;
            if (keyCode === 13) {
                var target = event.target;
                if (target.id) {
                    while (target.id === '') {
                        target = target.parentElement;
                    }
                    var targetId = target.id;
                    var component = _components.findById(targetId);
                    if (component) {
                        var func = _event.enter[component.id];
                        if (func) {
                            func(component, event);
                        }
                    }
                }
            }
        }
    });
//返回
    return self;
});