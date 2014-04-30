define(function(require) {
    var _yy = require('yy');
    require('yy/panel');
    require('yy/list');
    require('yy/label');
    require('yy/button');
    var _module = require('yy/module');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    var _utils = _yy.getUtils();
    self.init = function(thisModule) {
        thisModule.setContext({userId: '271411'});
        var userId = _yy.getSession('userId');
        var userName = _yy.getSession('userName');
        document.title = userName;
        var serviceInfo = thisModule.findChildByKey('service-info');
        serviceInfo.setLabel('工号:' + userId + ' 昵称:' + userName);
        //初始化聊天列表
        var messageList = thisModule.findChildByKey('message-list');
        messageList.init({
            key: 'userId',
            itemClazz: 'hide',
            itemDataToHtml: function(itemData) {
                var result = '<div class="chat_title">' + itemData.nickName + '</div>'
                        + '<div id="' + itemData.userId + '-chat-message-list" class="list chat_message_list scroll_list" scroll="true"></div>';
                return result;
            },
            itemCompleted: function(itemCom) {
                var chatListId = itemCom.key + '-chat-message-list';
                var chatList = itemCom.findChildByKey(chatListId);
                chatList.init({
                    key: 'messageId',
                    itemClazz: '',
                    itemDataToHtml: function(itemData) {
                        var serviceId = _yy.getSession('userId');
                        var result;
                        if (itemData.receiveId === serviceId) {
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
            }
        });
        //初始化玩家列表
        var customerList = thisModule.findChildByKey('customer-list');
        customerList.init({
            key: 'userId',
            itemClazz: 'online',
            itemDataToHtml: function(itemData) {
                var result = '<div class="inline_block w100">' + itemData.nickName + '</div>'
                        + '<div class="customer_state"></div>';

                return result;
            },
            itemCompleted: function(itemCom) {
                _event.bind(itemCom, 'click', function(thisCom) {
                    var userId = thisCom.key;
                    thisCom.selected();
                    //切换聊天窗口
                    var messageItem = messageList.getItemByKey(userId);
                    messageItem.selected();
                    //
                    var chatListId = userId + '-chat-message-list';
                    var chatList = messageItem.findChildByKey(chatListId);
                    chatList.initScroll();
                    //
                    var charForm = thisModule.findChildByKey('chat-form');
                    charForm.setData('receiveId', userId);
                });
            }
        });
        //
        _message.listen(customerList, 'CONNECT_SERVICE', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                thisCom.addItemData(data);
                messageList.addItemData(data);
                var message = {
                    messageId: 1,
                    message: '工号:' + data.serviceId + ' ' + data.serviceName + '为您服务！有什么可以帮助您?',
                    sendId: data.serviceId,
                    receiveId: data.userId,
                    createTime: _utils.getDateTime()
                };
                var messageItem = messageList.getItemByKey(data.userId);
                if (messageItem) {
                    var chatListId = data.userId + '-chat-message-list';
                    var chatList = messageItem.findChildByKey(chatListId);
                    if (chatList) {
                        chatList.addItemData(message);
                        chatList.scrollBottom();
                    }
                }
                if (thisCom.size() === 1) {
                    thisCom.firstChild.$this.click();
                }
            }
        });
        _message.listen(customerList, 'CUSTOMER_LOGOUT', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                var customerItem = thisCom.getItemByKey(data.userId);
                customerItem.$this.removeClass('online');
                var message = {
                    messageId: 0,
                    message: '玩家已离开',
                    sendId: data.userId,
                    receiveId: data.serviceId,
                    createTime: _utils.getDateTime()
                };
                var messageItem = messageList.getItemByKey(data.userId);
                if (messageItem) {
                    var chatListId = data.userId + '-chat-message-list';
                    var chatList = messageItem.findChildByKey(chatListId);
                    if (chatList) {
                        chatList.addItemData(message);
                        chatList.scrollBottom();
                    }
                }
            }
        });
        _message.listen(messageList, 'SEND_MESSAGE', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                var customerId;
                var serviceId = _yy.getSession('userId');
                if (data.sendId === serviceId) {
                    customerId = data.receiveId;
                } else {
                    customerId = data.sendId;
                }
                var messageItem = thisCom.getItemByKey(customerId);
                if (messageItem) {
                    var chatListId = customerId + '-chat-message-list';
                    var chatList = messageItem.findChildByKey(chatListId);
                    if (chatList) {
                        chatList.addItemData(data);
                        chatList.scrollBottom();
                    }
                }
            }
        });
        //
        var sendButton = thisModule.findChildByKey('send-button');
        _event.bind(sendButton, 'click', function(thisCom) {
            var chatForm = thisModule.findChildByKey('chat-form');
            var msg = chatForm.getData();
            msg.act = 'SEND_MESSAGE';
            _message.send(msg);
            chatForm.setData('message', '');
        });
        //
        var finishButton = thisModule.findChildByKey('finish-button');
        _event.bind(finishButton, 'click', function(thisCom) {
            var chatForm = thisModule.findChildByKey('chat-form');
            var data = chatForm.getData();
            var customerItem = customerList.getItemByKey(data.receiveId);
            if (customerItem.$this.hasClass('online')) {
                var operateInfo = thisModule.findChildByKey('operate-info');
                operateInfo.setLabel('正在与该玩家通话中,不能关闭聊天窗口.');
            } else {
                customerItem.remove();
                var messageItem = messageList.getItemByKey(data.receiveId);
                messageItem.remove();
            }
        });
        //
        var logoutButton = thisModule.findChildByKey('logout-button');
        _event.bind(logoutButton, 'click', function(thisCom) {
            var isOnline = false;
            for (var id in customerList.children) {
                if (customerList.children[id].$this.hasClass('online')) {
                    isOnline = true;
                    break;
                }
            }
            if (isOnline) {
                var operateInfo = thisModule.findChildByKey('operate-info');
                operateInfo.setLabel('正在与玩家通话中,不能退出.');
            } else {
                var msg = {
                    act: 'SERVICE_LOGOUT'
                };
                _message.send(msg);
                //
                _yy.clearSession();
                thisModule.hide();
                thisModule.remove();
                document.title = 'im-客服';
                _module.loadModule('', 'service-login');
            }
        });
        //
        window.onbeforeunload = function(e) {
            var isOnline = false;
            for (var id in customerList.children) {
                if (customerList.children[id].$this.hasClass('online')) {
                    isOnline = true;
                    break;
                }
            }
            if (isOnline) {
                var operateInfo = thisModule.findChildByKey('operate-info');
                operateInfo.setLabel('正在与玩家通话中,不能退出.');
                //阻止默认浏览器动作(W3C)
                if (e && e.preventDefault)
                    e.preventDefault();
//IE中阻止函数器默认动作的方式
                else
                    window.event.returnValue = '正在与玩家通话中,不能退出.';
                return '正在与玩家通话中,不能退出.';
            }
        };
        $(window).unload(function() {
            var msg = {
                act: 'SERVICE_LOGOUT'
            };
            _message.send(msg);
            //
            _yy.clearSession();
            thisModule.hide();
            thisModule.remove();
            document.title = 'im-客服';
            _module.loadModule('', 'service-login');
        });
    };
    return self;
});