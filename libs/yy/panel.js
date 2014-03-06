define(function(require) {
    var yy = require('./yy');
    var index = yy.getIndex();
    var utils = yy.getUtils();
    var event = yy.getEvent();
    var self = {};
    self.parameters = ['scroll'];
    self.create = function(component, parameters) {
        var _extend = {};
        component._extend = _extend;
        component._utils = utils;
        if (parameters.scroll === 'true') {
            //可以拥有滚动条
            _extend.scroll = 'true';
            var id = index.nextIndex();
            var scrollHtml = '<div id="' + id + '" class="scroll"></div>';
            component.$this.append(scrollHtml);
            var $scroll = $('#' + id);
            _extend.$scroll = $scroll;
            //绑定滚动事件
            event.bind(component, 'mousewheel', function(com, event, delta, deltaX, deltaY) {
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
        return component;
    };
    return self;
});


