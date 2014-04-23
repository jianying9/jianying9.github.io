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
        var loginButton = thisModule.findChildByKey('login-button');
        _event.bind(loginButton, 'click', function(thisCom) {
            var loginForm = thisModule.findChildByKey('login-form');
            var msg = loginForm.getData();
            //必填检测
            var validate = _utils.validate(msg, loginValidate);
            if (validate) {
                msg.act = 'ADMIN_LOGIN';
                msg.password = CryptoJS.MD5(msg.password).toString();
                _message.send(msg);
                loginForm.setData('password', '');
            }
        });
        //
        _message.listen(loginButton, 'ADMIN_LOGIN', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                //登录成功
                thisModule.hide();
                thisModule.remove();
                _module.loadModule('', 'admin-home');
            } else {
                //登录失败
                var infoLogin = thisModule.findChildByKey('info-login');
                var info ="登录失败";
                if(msg.flag === 'FAILURE_USER_ID_NOT_EXIST') {
                    info = "用户不存在";
                } else if (msg.flag === 'FAILURE_PASSWORD_ERROR') {
                    info = "密码错误";
                }
                infoLogin.setLabel(info);
            }
        });
    };
    return self;
});