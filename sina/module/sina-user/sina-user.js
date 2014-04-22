define(function(require) {
    var _yy = require('yy');
    require('yy/panel');
    require('yy/list');
    require('yy/button');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    var _utils = _yy.getUtils();
    self.init = function(thisModule) {
        var sinaList = thisModule.findChildByKey('sina-list');
        sinaList.init({
            key: 'userId',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                var shortDate = _utils.shortDate(itemData.lastUpdateTime);
                var result = '<div class="inline_block w100">' + itemData.userId + '</div>'
                        + '<div class="inline_block w100">' + itemData.location + '</div>'
                        + '<div class="inline_block w150">' + itemData.nickName + '</div>'
                        + '<div class="inline_block w50">' + itemData.gender + '</div>'
                        + '<div class="inline_block w100">' + itemData.empName + '</div>'
                        + '<div class="inline_block w100">' + shortDate + '</div>';
                return result;
            }
        });
        //sina用户列表消息
        _message.listen(sinaList, 'INQUIRE_SINA_USER', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                if (data.length > 0) {
                    //有记录
                    thisCom.clear();
                    thisCom.loadData(data);
                }
            }
        });
        //添加刷新按钮
        var refreshButton = thisModule.findChildByKey('refresh-button');
        _event.bind(refreshButton, 'click', function(thisCom) {
            _message.send({
                act: 'INQUIRE_SINA_USER',
                pageIndex: '1',
                pageSize: '25'
            });
        });
        //停止按钮
        var stopButton = thisModule.findChildByKey('stop-button');
        _event.bind(stopButton, 'click', function(thisCom) {
            _message.send({
                act: 'UPDATE_OLDEST_SINA_USER',
                operate: 'stop'
            });
        });
        //页面初始化
        _message.send({
            act: 'INQUIRE_SINA_USER',
            pageIndex: '1',
            pageSize: '25'
        });
    };
    return self;
});