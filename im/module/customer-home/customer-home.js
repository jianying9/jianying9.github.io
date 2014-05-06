define(function(require) {
    var _yy = require('yy');
    require('yy/panel');
    require('yy/button');
    require('yy/list');
    var _module = require('yy/module');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    var _utils = _yy.getUtils();
    self.init = function(thisModule) {
        var waitPanel = thisModule.findChildByKey('wait-panel');
        var chatPanel = thisModule.findChildByKey('chat-panel');
        var customerName = _yy.getSession('customerName');
        document.title = customerName;
        var chatMessageList = thisModule.findChildByKey('chat-message-list');
        chatMessageList.init({
            key: 'messageId',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                var result;
                if (itemData.from === 's') {
                    result = '<div class="chat_message_friend">';
                } else {
                    result = '<div class="chat_message_me">';
                }
                var createTime = _utils.shortDate(itemData.createTime);
                result += '<div class="chat_message_time">' + createTime + '</div>';
                result += '<div class="chat_message">' + itemData.message + '</div>';
                result += '<div class="team_arrows chat_message_arrows"></div>';
                result += '</div>';
                return result;
            }
        });
        _message.listen(chatMessageList, 'SEND_MESSAGE', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                thisCom.addItemData(data);
                thisCom.scrollBottom();
            }
        });
        //
        var welcomeInfo = thisModule.findChildByKey('welcome-info');
        welcomeInfo.setLabel(customerName);
        //
        var waitInfo = thisModule.findChildByKey('wait-info');
        _message.listen(waitInfo, 'CUSTOMER_WAIT', function(thisCom, msg) {
            var info;
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                info = '前面有' + data.waitNum + '位玩家等候中...';
                thisModule.setContext({
                    waitNum: data.waitNum,
                    waitOrder: data.waitOrder
                });
            } else {
                //登录失败
                info = '系统异常，非常遗憾！';
                if (msg.flag === 'FAILURE_WAIT') {
                    info = '服务器爆满，请耐心等待……';
                }
            }
            thisCom.setLabel(info);
        });
        _message.listen(waitInfo, 'CUSTOMER_LOGOUT', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                var waitOrder = thisModule.getContext('waitOrder');
                if (waitOrder && data.waitOrder > -1 && waitOrder > data.waitOrder) {
                    var waitNum = thisModule.getContext('waitNum');
                    waitNum--;
                    thisModule.setContext({
                        waitNum: waitNum
                    });
                    info = '前面有' + waitNum + '玩家等候中...';
                    thisCom.setLabel(info);
                }
            }
        });
        //
        _message.listen(waitInfo, 'ALLOT_WAIT_CUSTOMER', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                waitPanel.hide();
                chatPanel.show();
                var customerInfo = thisModule.findChildByKey('customer-info');
                customerInfo.setLabel(data.customerName);
                var charForm = thisModule.findChildByKey('chat-form');
                charForm.setData('serviceId', data.serviceId);
                //添加欢迎消息
                var message = {
                    messageId: 1,
                    message: '工号:' + data.serviceId + ' ' + data.serviceName + '为您服务！有什么可以帮助您?',
                    serviceId: data.serviceId,
                    customerId: data.customerId,
                    type: 'text',
                    from: 's',
                    createTime: _utils.getDateTime()
                };
                chatMessageList.addItemData(message);
                chatMessageList.scrollBottom();
            }
        });
        //
        _message.listen(chatMessageList, 'SEND_MESSAGE_FROM_CUSTOMER', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                thisCom.addItemData(data);
                thisCom.scrollBottom();
            }
        });
        //
        _message.listen(chatMessageList, 'SEND_MESSAGE_FROM_SERVICE', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                thisCom.addItemData(data);
                thisCom.scrollBottom();
            }
        });
        //
        var sendButton = thisModule.findChildByKey('send-button');
        _event.bind(sendButton, 'click', function(thisCom) {
            var charForm = thisModule.findChildByKey('chat-form');
            var msg = charForm.getData();
            msg.act = 'SEND_MESSAGE_FROM_CUSTOMER';
            _message.send(msg);
            charForm.setData('message', '');
        });
        //
        var finishButton = thisModule.findChildByKey('finish-button');
        _event.bind(finishButton, 'click', function(thisCom) {
            var charForm = thisModule.findChildByKey('chat-form');
            var msg = charForm.getData();
            msg.act = 'CUSTOMER_LOGOUT';
            var waitOrder = thisModule.getContext('waitOrder');
            if (waitOrder) {
                msg.waitOrder = waitOrder;
            }
            _message.send(msg);
            //
            _yy.clearSession();
            thisModule.hide();
            thisModule.remove();
            document.title = 'im-玩家';
            _module.loadModule('', 'customer-login');
        });
        //
        $(window).unload(function() {
            var charForm = thisModule.findChildByKey('chat-form');
            var msg = charForm.getData();
            var waitOrder = thisModule.getContext('waitOrder');
            if (waitOrder) {
                msg.waitOrder = waitOrder;
            }
            msg.act = 'CUSTOMER_LOGOUT';
            _message.send(msg);
        });
        //连接
        _message.send({act: 'CUSTOMER_WAIT'});
    };
    return self;
});