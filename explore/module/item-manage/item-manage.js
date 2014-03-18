define(function(require) {
    var yy = require('yy');
    require('yy/button');
    require('yy/label');
    require('yy/form');
    require('yy/list');
    var _event = yy.getEvent();
    var _message = yy.getMessage();
    var self = {};
    self.init = function(thisModule) {
        //物品表单按钮
        var toItemFormButton = thisModule.findChildByKey('to-item-form-button');
        _event.bind(toItemFormButton, 'click', function(thisCom) {
            var itemForm = thisModule.findChildByKey('item-form');
            if(itemForm.isVisible()) {
                itemForm.hide();
            } else {
                itemForm.show();
            }
        });
        //新增物品按钮
        var insertItemButton = thisModule.findChildByKey('insert-item-button');
        _event.bind(insertItemButton, 'click', function(thisCom) {
            var itemForm = thisModule.findChildByKey('item-form');
            
        });
    };
    return self;
});