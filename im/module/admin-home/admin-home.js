define(function(require) {
    var _yy = require('yy');
    require('yy/panel');
    require('yy/button');
    var module = require('yy/module');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    self.init = function(thisModule) {
        //默认加载userPanel
        var userManagePanel = thisModule.findChildByKey('user-manage-panel');
        var toUserManageButton = thisModule.findChildByKey('to-user-manage-button');
        //导航集合
        var navs = [
            {
                panel: userManagePanel,
                btn: toUserManageButton,
                module: 'user-manage'
            }
        ];
        //默认页面
        module.loadModule(userManagePanel.id, 'user-manage', function() {
        });
        thisModule.setContext({
            visiblePanel: userManagePanel,
            visibleButton: toUserManageButton
        });
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