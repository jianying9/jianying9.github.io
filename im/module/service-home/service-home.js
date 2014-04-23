define(function(require) {
    var _yy = require('yy');
    require('yy/panel');
    require('yy/list');
    require('yy/button');
    var module = require('yy/module');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    var _utils = _yy.getUtils();
    self.init = function(thisModule) {
        thisModule.setContext({userId: '271411'});
        var customerData = [
            {userId: 1, userName: 'c1'},
            {userId: 2, userName: 'c2'},
            {userId: 3, userName: 'c3'},
            {userId: 4, userName: 'c4'}
        ];
        //初始化聊天列表
        var messageList = thisModule.findChildByKey('message-list');
        messageList.init({
            key: 'userId',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                var result = '<div class="chat_title">' + itemData.userName + '</div>'
                        + '<div id="' + itemData.userId + '-chat-list" class="list chat_message_list scroll_list" scroll="true"></div>';
                return result;
            },
            itemCompleted: function(itemCom) {
                var chatListId = itemCom.key + '-chat-list';
                var chatList = itemCom.findChildByKey(chatListId);
                chatList.init({
                    key: 'messageId',
                    itemClazz: '',
                    itemDataToHtml: function(itemData) {
                        var serviceId = thisModule.getContext('userId');
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
                //
                var chatData = [
                    {messageId: 1, receiveId: itemCom.key, sendId: '271411', message: itemCom.key +'你好啊！！！！！！！！！！！！！', createTime: '2014-04-23 14:01:22'},
                    {messageId: 1, receiveId: '271411', sendId: itemCom.key, message: '你好，什么事', createTime: '2014-04-23 14:01:30'},
                    {messageId: 1, receiveId: itemCom.key, sendId: '271411', message: '就问好下', createTime: '2014-04-23 14:01:35'},
                    {messageId: 1, receiveId: '271411', sendId: itemCom.key, message: '无语', createTime: '2014-04-23 14:01:42'},
                    {messageId: 1, receiveId: itemCom.key, sendId: '271411', message: '别这样啊', createTime: '2014-04-23 14:01:44'},
                    {messageId: 1, receiveId: '271411', sendId: itemCom.key, message: '你想怎么样？', createTime: '2014-04-23 14:01:46'}
                ];
                chatList.loadData(chatData);
                chatList.scrollBottom();
                itemCom.$this.addClass('hide');
            }
        });
        messageList.loadData(customerData);
        //初始化玩家列表
        var customerList = thisModule.findChildByKey('customer-list');
        customerList.init({
            key: 'userId',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                var result = '<div class="inline_block w150">' + itemData.userName + '</div>'
                return result;
            },
            itemCompleted: function(itemCom) {
                _event.bind(itemCom, 'click', function(thisCom) {
                    var userId = thisCom.key;
                    thisCom.selected();
                    //切换聊天窗口
                    var messageItem = messageList.getItemByKey(userId);
                    messageItem.selected();
                });
            }
        });
        customerList.loadData(customerData);
        customerList.firstChild.$this.click();
    };
    return self;
});