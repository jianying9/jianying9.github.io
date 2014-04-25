define(function(require) {
    var _yy = require('yy');
    require('yy/form');
    require('yy/button');
    require('yy/label');
    require('crypto.md5');
    var _module = require('yy/module');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    var _utils = _yy.getUtils();
    self.init = function(thisModule) {
        //新增帐号按钮
        var loginValidate = {
            userId: {
                success: function() {
                    var infoUserId = thisModule.findChildByKey('info-user-id');
                    infoUserId.setLabel('');
                },
                faliure: function() {
                    var infoUserId = thisModule.findChildByKey('info-user-id');
                    infoUserId.setLabel('帐号不能为空');
                }
            }
        };
        var loginButton = thisModule.findChildByKey('login-button');
        _event.bind(loginButton, 'click', function(thisCom) {
            var loginForm = thisModule.findChildByKey('login-form');
            var msg = loginForm.getData();
            //必填检测
            var validate = _utils.validate(msg, loginValidate);
            if (validate) {
                msg.act = 'SERVICE_LOGIN';
                _message.send(msg);
            }
        });
        //
        _message.listen(loginButton, 'SERVICE_LOGIN', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                //登录成功
                _yy.setSession(msg.data);
                thisModule.hide();
                thisModule.remove();
                _module.loadModule('', 'service-home');
            } else {
                //登录失败
                var infoLogin = thisModule.findChildByKey('info-login');
                var info ='登录失败';
                if(msg.flag === 'FAILURE_USER_ID_NOT_EXIST') {
                    info = '用户不存在';
                }
                infoLogin.setLabel(info);
            }
        });
    };
    return self;
});