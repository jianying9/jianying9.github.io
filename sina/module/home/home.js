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
        var sinaUserPanel = thisModule.findByKey('sina-user-panel');
        var toSinaUserButton = thisModule.findByKey('to-sina-user-button');
        //spiderUserPanel
        var spiderUserPanel = thisModule.findByKey('spider-user-panel');
        var toSpiderUserButton = thisModule.findByKey('to-spider-user-button');
        //genderCubePanel
        var genderCubePanel = thisModule.findByKey('gender-cube-panel');
        var toGenderCubeButton = thisModule.findByKey('to-gender-cube-button');
        //locationCubePanel
        var locationCubePanel = thisModule.findByKey('location-cube-panel');
        var toLocationCubeButton = thisModule.findByKey('to-location-cube-button');
        //tagCubePanel
        var tagCubePanel = thisModule.findByKey('tag-cube-panel');
        var toTagCubeButton = thisModule.findByKey('to-tag-cube-button');
        //sinaUserCubePanel
        var sinaUserCubePanel = thisModule.findByKey('sina-user-cube-panel');
        var toSinaUserCubeButton = thisModule.findByKey('to-sina-user-cube-button');
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
            },
            {
                panel: sinaUserCubePanel,
                btn: toSinaUserCubeButton,
                module: 'sina-user-cube'
            }
        ];
        //默认页面
        module.loadModule('location-cube', function() {
        }, locationCubePanel);
        thisModule.setContext({
            visiblePanel: locationCubePanel,
            visibleButton: toLocationCubeButton
        });
        //绑定导航按钮事件
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
                            module.loadModule(moduleName, function() {
                            }, thisPanel);
                            break;
                        }
                    }
                }
            });
        }
    };
    return self;
});