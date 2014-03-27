define(function(require) {
    var _yy = require('yy');
    require('yy/label');
    var self = {};
    var _message = _yy.getMessage();
    self.init = function(thisModule) {
        var nickName = _yy.getSession('nickName');
        var nickNameLabel = thisModule.findChildByKey('nick-name');
        nickNameLabel.setLabel(nickName);
        var usedPointLabel = thisModule.findChildByKey('used-point');
        _message.listen(usedPointLabel, 'INQUIRE_POINT', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                var myPointLabel = thisModule.findChildByKey('my-point');
                myPointLabel.setLabel('获得积分:' + data.myPoint);
                var promoterPointLabel = thisModule.findChildByKey('promoter-point');
                promoterPointLabel.setLabel('推广积分:' + data.promoterPoint);
                var consumePointLabel = thisModule.findChildByKey('consume-point');
                consumePointLabel.setLabel('消费积分:' + data.consumePoint);
                var used = data.myPoint + data.promoterPoint - data.consumePoint;
                thisCom.setLabel('可用积分:' + used);
            }
        });
        _message.send({
            act: 'INQUIRE_POINT'
        });
    };
    return self;
});