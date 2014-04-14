define(function(require) {
    var _yy = require('yy');
    require('yy/form');
    require('yy/label');
    require('yy/panel');
    require('yy/button');
    require('yy/list');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    var _utils = _yy.getUtils();
    self.init = function(thisModule) {
        //初始化列表
        var spiderList = thisModule.findChildByKey('spider-list');
        spiderList.init({
            key: 'userName',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                var state = '可用';
                if (itemData.cookie.indexOf('SUE=') === -1) {
                    state = '不可用';
                }
                var result = '<div class="inline_block w200">' + itemData.userName + '</div>'
                        + '<div class="inline_block w200">' + itemData.password + '</div>'
                        + '<div class="inline_block w200">' + state + '</div>'
                        + '<div class="inline_block w200">' + itemData.lastUpdateTime + '</div>'
                        + '<div id="' + itemData.userName + '-delete-button" class="button link float_right">删除</div>';
                return result;
            },
            itemCompleted: function(itemCom) {
                var deleteButtonId = itemCom.key + '-delete-button';
                var deleteButton = itemCom.findChildByKey(deleteButtonId);
                _event.bind(deleteButton, 'click', function(thisCom) {
                    var msg = {
                        act: 'DELETE_SPIDER_USER',
                        userName: itemCom.key
                    };
                    _message.send(msg);
                });
            }
        });
        //帐号列表消息事件
        _message.listen(spiderList, 'INSERT_SPIDER_USER', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                thisCom.addItemDataFirst(data);
            }
        });
        _message.listen(spiderList, 'DELETE_SPIDER_USER', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var itemId = msg.data.itemId;
                thisCom.removeItem(itemId);
            }
        });
        _message.listen(spiderList, 'INQUIRE_SPIDER_USER', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                if (data.length > 0) {
                    //有记录
                    thisCom.loadData(data);
                } else {
                    var spiderForm = thisModule.findChildByKey('spider-form');
                    spiderForm.show();
                }
            }
        });
        //添加帐号表单按钮
        var toSpiderFormButton = thisModule.findChildByKey('to-spider-form-button');
        _event.bind(toSpiderFormButton, 'click', function(thisCom) {
            var spiderForm = thisModule.findChildByKey('spider-form');
            if (spiderForm.isVisible()) {
                spiderForm.hide();
            } else {
                spiderForm.show();
            }
        });
        //新增帐号按钮
        var spiderValidate = {
            userName: {
                success: function() {
                    var infoUserName = thisModule.findChildByKey('info-user-name');
                    infoUserName.setLabel('');
                },
                faliure: function() {
                    var infoUserName = thisModule.findChildByKey('info-user-name');
                    infoUserName.setLabel('帐号不能为空');
                }
            },
            password: {
                success: function() {
                    var infoPassword = thisModule.findChildByKey('info-password');
                    infoPassword.setLabel('');
                },
                faliure: function() {
                    var infoPassword = thisModule.findChildByKey('info-password');
                    infoPassword.setLabel('密码不能为空');
                }
            }
        };
        var insertSpiderButton = thisModule.findChildByKey('insert-spider-button');
        _event.bind(insertSpiderButton, 'click', function(thisCom) {
            var spiderForm = thisModule.findChildByKey('spider-form');
            var msg = spiderForm.getData();
            //必填检测
            var validate = _utils.validate(msg, spiderValidate);
            if (validate) {
                msg.act = 'INSERT_SPIDER_USER';
                _message.send(msg);
            }
        });
        //页面初始化
        _message.send({
            act: 'INQUIRE_SPIDER_USER'
        });
    };
    return self;
});