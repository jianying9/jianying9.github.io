define(function(require) {
    var yy = require('yy');
    require('yy/panel');
    require('yy/button');
    var module = require('yy/module');
    var self = {};
    var _event = yy.getEvent();
    var _message = yy.getMessage();
    self.init = function(thisModule) {
        //默认加载sinaUserPanel
        var sinaUserPanel = thisModule.findChildByKey('sina-user-panel');
        var toSinaUserButton = thisModule.findChildByKey('to-sina-user-button');
        module.loadModule(sinaUserPanel.id, 'sina-user', function() {
        });
        thisModule.setContext({
            visiblePanel: sinaUserPanel,
            visibleButton: toSinaUserButton
        });
        //spiderUserPanel
        var spiderUserPanel = thisModule.findChildByKey('spider-user-panel');
        var toSpiderUserButton = thisModule.findChildByKey('to-spider-user-button');
        //导航集合
        var navs = [
            {
                panel: sinaUserPanel,
                btn: toSinaUserButton,
                module: 'sina-user'
            },
            {
                panel: spiderUserPanel,
                btn: toSpiderUserButton,
                module: 'spider-user'
            }
        ];
        //绑定导航按钮事件
        var panel;
        var btn;
        for (var index = 0; index < navs.length; index++) {
            btn = navs[index].btn;
            _event.bind(btn, 'click', function(thisCom) {
                var visiblePanel = thisModule.getContext('visiblePanel');
                var visibleButton = thisModule.getContext('visibleButton');
                var thisPanel;
                var thisBtn;
                var moduleName;
                if (thisCom !== visibleButton) {
                    visiblePanel.hide();
                    visibleButton.$this.removeClass('selected');
                    for (var index = 0; index < navs.length; index++) {
                        thisPanel = navs[index].panel;
                        thisBtn = navs[index].btn;
                        moduleName = navs[index].module;
                        if (thisBtn === thisCom) {
                            thisPanel.show();
                            thisBtn.$this.addClass('selected');
                            thisModule.setContext({
                                visiblePanel: thisPanel,
                                visibleButton: thisBtn
                            });
                            module.loadModule(thisPanel.id, moduleName, function() {
                            });
                            break;
                        }
                    }
                }
            });
        }
    };
    return self;
});