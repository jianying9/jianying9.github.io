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
    var _cookie = _yy.getCookie();
    var _utils = _yy.getUtils();
    self.init = function(thisModule) {
        //login
        var loginValidate = {
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
        //登录按钮事件处理
        var loginButton = thisModule.findChildByKey('login-button');
        _event.bind(loginButton, 'click', function(thisCom) {
            var loginForm = thisModule.findChildByKey('login-form');
            var msg = loginForm.getData();
            //必填检测
            var validate = _utils.validate(msg,  loginValidate);
            if (validate) {
                msg.act = 'ADMIN_LOGIN';
                msg.password = CryptoJS.MD5(msg.password).toString();
                _message.send(msg);
                loginForm.setData('password', '');
            }
        });
        //登录消息处理
        _message.listen(loginButton, 'ADMIN_LOGIN', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                //
                var loginForm = thisModule.findChildByKey('login-form');
                var data = loginForm.getData();
                //保存session
                data = msg.data;
                _yy.setSession({
                    nickName: data.nickName,
                    userEmail: data.userEmail
                });
                //登录成功，跳转
                thisModule.hide();
                thisModule.remove();
                _module.loadModule('', 'admin-home');
            } else {
                //登录失败
                switch (msg.flag) {
                    case 'FAILURE_PASSWORD_ERROR':
                        var infoPassword = thisModule.findChildByKey('login-info-password');
                        infoPassword.setLabel('密码错误');
                        break;
                }
            }
        });
    };
    return self;
});