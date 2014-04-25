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
        var userList = thisModule.findChildByKey('user-list');
        userList.init({
            key: 'userId',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                var result = '<div class="inline_block w200">' + itemData.userId + '</div>'
                        + '<div class="inline_block w200">' + itemData.userName + '</div>'
                        + '<div class="inline_block w200">' + itemData.type + '</div>';
                if (itemData.type !== 'ADMIN') {
                    result += '<div id="' + itemData.userId + '-delete-button" class="button link float_right">删除</div>';
                }
                return result;
            },
            itemCompleted: function(itemCom) {
                var data = itemCom.getData();
                if (data.type !== 'ADMIN') {
                    var deleteButtonId = itemCom.key + '-delete-button';
                    var deleteButton = itemCom.findChildByKey(deleteButtonId);
                    _event.bind(deleteButton, 'click', function(thisCom) {
                        var msg = {
                            act: 'DELETE_SERVICE_USER',
                            userName: itemCom.key
                        };
                        _message.send(msg);
                    });
                }
            }
        });
        //帐号列表消息事件
        _message.listen(userList, 'INSERT_SERVICE_USER', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                thisCom.addItemDataFirst(data);
            }
        });
        _message.listen(userList, 'DELETE_SERVICE_USER', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var itemId = msg.data.itemId;
                thisCom.removeItem(itemId);
            }
        });
        _message.listen(userList, 'INQUIRE_SERVICE_USER', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                if (data.length > 0) {
                    //有记录
                    thisCom.setPageIndex(msg.pageIndex);
                    thisCom.setPageSize(msg.pageSize);
                    thisCom.loadData(data);
                    //
                    var moreButton = thisModule.findChildByKey('more-button');
                    if (msg.pageNum > msg.pageIndex) {
                        moreButton.show();
                    } else {
                        moreButton.hide();
                    }
                } else {
                    var userForm = thisModule.findChildByKey('user-form');
                    userForm.show();
                }
            }
        });
        //添加帐号表单按钮
        var toUserFormButton = thisModule.findChildByKey('to-user-form-button');
        _event.bind(toUserFormButton, 'click', function(thisCom) {
            var userForm = thisModule.findChildByKey('user-form');
            if (userForm.isVisible()) {
                userForm.hide();
            } else {
                userForm.show();
            }
        });
        //新增帐号按钮
        var userValidate = {
            userId: {
                success: function() {
                    var infoUserId = thisModule.findChildByKey('info-user-id');
                    infoUserId.setLabel('');
                },
                faliure: function() {
                    var infoUserId = thisModule.findChildByKey('info-user-id');
                    infoUserId.setLabel('帐号不能为空');
                }
            },
            userName: {
                success: function() {
                    var infoUserName = thisModule.findChildByKey('info-user-name');
                    infoUserName.setLabel('');
                },
                faliure: function() {
                    var infoUserName = thisModule.findChildByKey('info-user-name');
                    infoUserName.setLabel('姓名不能为空');
                }
            },
            type: {
                success: function() {
                    var infoType = thisModule.findChildByKey('info-type');
                    infoType.setLabel('');
                },
                faliure: function() {
                    var infoType = thisModule.findChildByKey('info-type');
                    infoType.setLabel('类型不能为空');
                }
            }
        };
        var insertUserButton = thisModule.findChildByKey('insert-user-button');
        _event.bind(insertUserButton, 'click', function(thisCom) {
            var userForm = thisModule.findChildByKey('user-form');
            var msg = userForm.getData();
            //必填检测
            var validate = _utils.validate(msg, userValidate);
            if (validate) {
                msg.act = 'INSERT_SERVICE_USER';
                _message.send(msg);
            }
        });
        //页面初始化
        _message.send({
            act: 'INQUIRE_SERVICE_USER',
            pageIndex: 1,
            pageSize: 10
        });
    };
    return self;
});