define(function(require) {
    var _yy = require('yy');
    require('yy/form');
    require('yy/button');
    require('yy/label');
    var _module = require('yy/module');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    var _utils = _yy.getUtils();
    self.init = function(thisModule) {
        //登录框
        var loginForm = thisModule.findChildByKey('login-form');
        _message.listen(loginForm, 'INQUIRE_CUSTOMER', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                thisCom.loadData(msg.data);
            }
        });
        _message.listen(loginForm, 'CUSTOMER_LOGIN', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                //登录成功
                _yy.setSession(msg.data);
                thisModule.hide();
                thisModule.remove();
                _module.loadModule('', 'customer-home');
            } else {
                //登录失败
                var infoLogin = thisModule.findChildByKey('info-login');
                var info = '登录失败';
                if (msg.flag === 'FAILURE_USER_ID_NOT_EXIST') {
                    info = '用户不存在';
                }
                infoLogin.setLabel(info);
            }
        });
        //随机帐号按钮
        var refreshButton = thisModule.findChildByKey('refresh-button');
        _event.bind(refreshButton, 'click', function(thisCom) {
            _message.send({act: 'INQUIRE_CUSTOMER'});
        });
        //登录按钮
        var loginButton = thisModule.findChildByKey('login-button');
        _event.bind(loginButton, 'click', function(thisCom) {
            var loginForm = thisModule.findChildByKey('login-form');
            var msg = loginForm.getData();
            msg.act = 'CUSTOMER_LOGIN';
            _message.send(msg);
        });
        //
        _message.send({act: 'INQUIRE_CUSTOMER'});
    };
    return self;
});