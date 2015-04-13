define(function(require) {
    var yy = require('yy');
    require('yy/panel');
    require('yy/button');
    var module = require('yy/module');
    var self = {};
    var _event = yy.getEvent();
    var _message = yy.getMessage();
    self.init = function(thisModule) {
        //默认加载pointPanel
        var pointPanel = thisModule.findChildByKey('point-panel');
        var toPointButton = thisModule.findChildByKey('to-point-button');
//        module.loadModule(pointPanel.id, 'point', function() {
//        });
//        thisModule.setContext({
//            visiblePanel: pointPanel,
//            visibleButton: toPointButton
//        });
        //绑定导航按钮事件
        //积分按钮
        _event.bind(toPointButton, 'click', function(thisCom) {
            var visiblePanel = thisModule.getContext('visiblePanel');
            if (visiblePanel.key !== 'point-panel') {
                var pointPanel = thisModule.findChildByKey('point-panel');
                visiblePanel.hide();
                var visibleButton = thisModule.getContext('visibleButton');
                visibleButton.$this.removeClass('selected');
                pointPanel.show();
                thisCom.$this.addClass('selected');
                thisModule.setContext({
                    visiblePanel: pointPanel,
                    visibleButton: thisCom

                });
            }
        });
        //兑换物品按钮
        var toItemButton = thisModule.findChildByKey('to-item-button');
        _event.bind(toItemButton, 'click', function(thisCom) {
            var visiblePanel = thisModule.getContext('visiblePanel');
            if (visiblePanel.key !== 'item-panel') {
                var itemPanel = thisModule.findChildByKey('item-panel');
                visiblePanel.hide();
                var visibleButton = thisModule.getContext('visibleButton');
                visibleButton.$this.removeClass('selected');
                itemPanel.show();
                module.loadModule(itemPanel.id, 'item', function() {
                });
                thisCom.$this.addClass('selected');
                thisModule.setContext({
                    visiblePanel: itemPanel,
                    visibleButton: thisCom
                });
            }
        });
        //物品管理按钮
        var toItemManageButton = thisModule.findChildByKey('to-item-manage-button');
        _event.bind(toItemManageButton, 'click', function(thisCom) {
            var visiblePanel = thisModule.getContext('visiblePanel');
            if (visiblePanel.key !== 'item-manage-panel') {
                var itemManagePanel = thisModule.findChildByKey('item-manage-panel');
                visiblePanel.hide();
                var visibleButton = thisModule.getContext('visibleButton');
                visibleButton.$this.removeClass('selected');
                itemManagePanel.show();
                module.loadModule(itemManagePanel.id, 'item-manage', function() {
                });
                thisCom.$this.addClass('selected');
                thisModule.setContext({
                    visiblePanel: itemManagePanel,
                    visibleButton: thisCom
                });
            }
        });
    };
    return self;
});