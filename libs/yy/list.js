define(function(require) {
    var yy = require('./yy');
    require('./list_item');
    var _index = yy.getIndex();
    var _utils = yy.getUtils();
    var _event = yy.getEvent();
    var _components = yy.getComponents();
    var self = {};
    self.parameters = ['scroll'];
    self.create = function(component, parameters) {
        var _extend = {};
        _extend.data = {};
        component._extend = _extend;
        component._utils = _utils;
        component._components = _components;
        if (parameters.scroll === 'true') {
            //可以拥有滚动条
            _extend.scroll = 'true';
            var id = _index.nextIndex();
            var scrollHtml = '<div id="' + id + '" class="scroll"></div>';
            component.$this.append(scrollHtml);
            var $scroll = $('#' + id);
            _extend.$scroll = $scroll;
            //绑定滚动事件
            _event.bind(component, 'mousewheel', function(com, event, delta, deltaX, deltaY) {
                if (com._extend.scroll === 'true') {
                    var scrollHeight = com.$this[0].scrollHeight;
                    var clientHeight = com.$this[0].clientHeight;
                    if (clientHeight < scrollHeight) {
                        var speed = 50;
                        var top = com.$this.scrollTop();
                        if (delta > 0) {
                            speed = -speed;
                        }
                        var newTop = top + speed;
                        if (newTop > scrollHeight - clientHeight) {
                            newTop = scrollHeight - clientHeight;
                        }
                        if (newTop < 0) {
                            newTop = 0;
                        }
                        com._utils.scrollTop(newTop, com);
                        com.$this.scrollTop(newTop);
                    }
                }
            });
        } else {
            _extend.scroll = 'false';
        }
        component.initScroll = function() {
            if (this._extend.scroll === 'true') {
                var $this = this.$this;
                var scrollHeight = $this[0].scrollHeight;
                var clientHeight = $this[0].clientHeight;
                if (clientHeight < scrollHeight) {
                    this._utils.initScroll(clientHeight, scrollHeight, this);
                }
            }
        };
        component.scrollBottom = function() {
            if (this._extend.scroll === 'true') {
                var $this = this.$this;
                var scrollHeight = $this[0].scrollHeight;
                var clientHeight = $this[0].clientHeight;
                var newTop = scrollHeight - clientHeight;
                this._utils.scrollTop(newTop, this);
                $this.scrollTop(newTop);
            }
        };
        component.scrollTop = function() {
            if (this._extend.scroll === 'true') {
                var $this = this.$this;
                this._utils.scrollTop(0, this);
                $this.scrollTop(0);
            }
        };
        //
        component.getPageIndex = function() {
            return this._extend.pageIndex;
        };
        component.setPageIndex = function(pageIndex) {
            this._extend.pageIndex = pageIndex;
        };
        component.getPageSize = function() {
            return this._extend.pageSize;
        };
        component.setPageSize = function(pageSize) {
            this._extend.pageSize = pageSize;
        };
        component.getPageNum = function() {
            return this._extend.pageNum;
        };
        component.setPageNum = function(pageNum) {
            this._extend.pageNum = pageNum;
        };
        component.getPageTotal = function() {
            return this._extend.pageTotal;
        };
        component.setPageTotal = function(pageTotal) {
            this._extend.pageTotal = pageTotal;
        };
        //
        component.init = function(config) {
            this._extend.itemDataToHtml = config.itemDataToHtml;
            this._extend.key = config.key;
            this._extend.itemClazz = config.itemClazz;
        };
        component.check = function() {
            if (!this._extend.key) {
                throw 'Un init list data key!id:' + this.id;
            }
            if (!this._extend.itemDataToHtml) {
                throw 'Un init list method itemDataToHtml!id:' + this.id;
            }
        };
        component.clear = function() {
            var child;
            for (var id in this.children) {
                child = this.children[id];
                if (child.type === 'list_item') {
                    child.remove();
                }
            }
            this.initScroll();
        };
        component.getItemData = function(keyValue) {
            return this._extend.data[keyValue];
        };
        component.loadData = function(data) {
            var that = this;
            that.check();
            var key = that._extend.key;
            var itemClazz = that._extend.itemClazz;
            var html = '';
            var itemData;
            var key;
            var localData = that._extend.data;
            for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
                itemData = data[dataIndex];
                key = itemData[key];
                if (!key && key !== 0) {
                    throw 'list loadData error! can not find value by key:' + key;
                }
                localData[key] = itemData;
                html += '<div id="' + key + '" class="list_item';
                if (itemClazz) {
                    html += ' ' + itemClazz;
                }
                html += '">';
                html += that._extend.itemDataToHtml(itemData);
                html += '</div>';
            }
            that.$this.append(html);
            //
            var $child = that.$this.children('.list_item');
            $child.each(function() {
                //判断子节点是否已经解析过，如果解析过就不在解析
                var $this = $(this);
                var id = $this.attr('id');
                if (!that.children[id]) {
                    that._components.create({
                        loaderId: that.loaderId,
                        type: 'list_item',
                        $this: $this,
                        parent: that
                    });
                }
            });
            that.initScroll();
        };
        component.addItemDataFirst = function(itemData) {
            var item;
            var that = this;
            that.check();
            var key = that._extend.key;
            var itemClazz = that._extend.itemClazz;
            var html = '';
            var localData = that._extend.data;
            var key = itemData[key];
            if (!key && key !== 0) {
                throw 'list addItemDataFirst error! can not find value by key:' + key;
            }
            if (localData[key]) {
                item = this.findChildByKey(key);
            } else {
                localData[key] = itemData;
                html += '<div id="' + key + '" class="list_item';
                if (itemClazz) {
                    html += ' ' + itemClazz;
                }
                html += '">';
                html += that._extend.itemDataToHtml(itemData);
                html += '</div>';

                var $firstChild = that.$this.children(':first-child');
                if ($firstChild.length > 0) {
                    $firstChild.before(html);
                } else {
                    that.$this.append(html);
                }
                //
                item = that._components.create({
                    loaderId: that.loaderId,
                    type: 'list_item',
                    $this: $('#' + key),
                    parent: that
                });
            }
            that.initScroll();
            that.scrollTop();
            return item;
        };
        component.getItem = function(keyValue) {
            var child;
            var result;
            for (var id in this.children) {
                child = this.children[id];
                if (child.key === keyValue) {
                    result = child;
                    break;
                }
            }
            return result;
        };
        component.removeItem = function(keyValue) {
            var child;
            for (var id in this.children) {
                child = this.children[id];
                if (child.key === keyValue) {
                    child.remove();
                }
            }
            delete this.extend.data[keyValue];
            this._initScroll();
        };
        component.size = function() {
            var num = 0;
            for (var id in this._extend.data) {
                num++;
            }
            return num;
        };
        return component;
    };
    return self;
});


