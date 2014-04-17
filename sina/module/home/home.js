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
        //spiderUserPanel
        var spiderUserPanel = thisModule.findChildByKey('spider-user-panel');
        var toSpiderUserButton = thisModule.findChildByKey('to-spider-user-button');
        //genderCubePanel
        var genderCubePanel = thisModule.findChildByKey('gender-cube-panel');
        var toGenderCubeButton = thisModule.findChildByKey('to-gender-cube-button');
        //locationCubePanel
        var locationCubePanel = thisModule.findChildByKey('location-cube-panel');
        var toLocationCubeButton = thisModule.findChildByKey('to-location-cube-button');
        //tagCubePanel
        var tagCubePanel = thisModule.findChildByKey('tag-cube-panel');
        var toTagCubeButton = thisModule.findChildByKey('to-tag-cube-button');
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
            },
            {
                panel: genderCubePanel,
                btn: toGenderCubeButton,
                module: 'gender-cube'
            },
            {
                panel: locationCubePanel,
                btn: toLocationCubeButton,
                module: 'location-cube'
            },
            {
                panel: tagCubePanel,
                btn: toTagCubeButton,
                module: 'tag-cube'
            }
        ];
        //默认页面
        module.loadModule(locationCubePanel.id, 'location-cube', function() {
        });
        thisModule.setContext({
            visiblePanel: locationCubePanel,
            visibleButton: toLocationCubeButton
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