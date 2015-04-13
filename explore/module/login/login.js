define(function(require) {
    var _yy = require('yy');
    require('yy/panel');
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
        //获取url参数
        var urlPara = _yy.getUrlPara();
        var panel = urlPara.panel;
        var promoter = urlPara.promoter;
        if (panel && panel === 'register') {
            //注册
            var loginPanel = thisModule.findChildByKey('login-panel');
            if (loginPanel.isVisible()) {
                var registerPanel = thisModule.findChildByKey('register-panel');
                loginPanel.hide();
                registerPanel.show();
            }
            //赋值
            var registerForm = thisModule.findChildByKey('register-form');
            registerForm.setData('promoter', promoter);
        }
        //获取cookie
        var lastLoginName = _cookie.getCookie('lastLoginName');
        if (lastLoginName) {
            var loginForm = thisModule.findChildByKey('login-form');
            loginForm.setData('userEmail', lastLoginName);
        }
        //login
        var loginValidate = {
            userEmail: {
                success: function() {
                    var infoUserEmail = thisModule.findChildByKey('login-info-user-email');
                    infoUserEmail.setLabel('');
                },
                faliure: function() {
                    var infoUserEmail = thisModule.findChildByKey('login-info-user-email');
                    infoUserEmail.setLabel('邮箱不能为空');
                }
            },
            password: {
                success: function() {
                    var infoPassword = thisModule.findChildByKey('login-info-password');
                    infoPassword.setLabel('');
                },
                faliure: function() {
                    var infoPassword = thisModule.findChildByKey('login-info-password');
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
                msg.act = 'LOGIN';
                msg.password = CryptoJS.MD5(msg.password).toString();
                _message.send(msg);
                loginForm.setData('password', '');
            }
        });
        //登录消息处理
        _message.listen(loginButton, 'LOGIN', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                //
                var loginForm = thisModule.findChildByKey('login-form');
                var data = loginForm.getData();
                //保存cookie
                _cookie.setCookie('lastLoginName', data.userEmail, {expires: 7});
                //保存session
                data = msg.data;
                _yy.setSession({
                    nickName: data.nickName,
                    userEmail: data.userEmail
                });
                //登录成功，跳转
                thisModule.hide();
                thisModule.remove();
                _module.loadModule('', 'home');
            } else {
                //登录失败
                switch (msg.flag) {
                    case 'FAILURE_LOGIN_NOT_EXIST':
                        var infoUserEmail = thisModule.findChildByKey('login-info-user-email');
                        infoUserEmail.setLabel('昵称或邮箱不存在');
                        break;
                    case 'FAILURE_PASSWORD_ERROR':
                        var infoPassword = thisModule.findChildByKey('login-info-password');
                        infoPassword.setLabel('密码错误');
                        break;
                }
            }
        });
        //切换到注册页面按钮事件处理
        var toRegisterButton = thisModule.findChildByKey('to-register-button');
        _event.bind(toRegisterButton, 'click', function(thisCom) {
            var loginPanel = thisModule.findChildByKey('login-panel');
            if (loginPanel.isVisible()) {
                var registerPanel = thisModule.findChildByKey('register-panel');
                loginPanel.hide();
                registerPanel.show();
            }
        });
        //register
        var registerValidate = {
            nickName: {
                success: function() {
                    var infoNickName = thisModule.findChildByKey('register-info-nick-name');
                    infoNickName.setLabel('');
                },
                faliure: function() {
                    var infoNickName = thisModule.findChildByKey('register-info-nick-name');
                    infoNickName.setLabel('昵称不能为空');
                }
            },
            userEmail: {
                success: function() {
                    var infoUserEmail = thisModule.findChildByKey('register-info-user-email');
                    infoUserEmail.setLabel('');
                },
                faliure: function() {
                    var infoUserEmail = thisModule.findChildByKey('register-info-user-email');
                    infoUserEmail.setLabel('邮箱不能为空');
                }
            },
            password: {
                success: function() {
                    var infoPassword = thisModule.findChildByKey('register-info-password');
                    infoPassword.setLabel('');
                },
                faliure: function() {
                    var infoPassword = thisModule.findChildByKey('register-info-password');
                    infoPassword.setLabel('密码不能为空');
                }
            }
        };
        //注册按钮事件处理
        var registerButton = thisModule.findChildByKey('register-button');
        _event.bind(registerButton, 'click', function(thisCom) {
            var registerForm = thisModule.findChildByKey('register-form');
            var msg = registerForm.getData();
            var validate = _utils.validate(msg,  registerValidate);
            //必填检测
            if (validate) {
                //判断密码和密码确认是否一致
                var infoCheck = thisModule.findChildByKey('register-info-check');
                if (msg.password === msg.check) {
                    infoCheck.setLabel('');
                    //一致
                    msg.act = 'REGISTER';
                    msg.password = CryptoJS.MD5(msg.password).toString();
                    _message.send(msg);
                } else {
                    //不一致
                    registerForm.setData('check', '');
                    infoCheck.setLabel('密码不一致');
                }
            }
        });
        //切换到登录页面按钮事件处理
        var toLoginButton = thisModule.findChildByKey('to-login-button');
        _event.bind(toLoginButton, 'click', function(thisCom) {
            var registerPanel = thisModule.findChildByKey('register-panel');
            if (registerPanel.isVisible()) {
                var loginPanel = thisModule.findChildByKey('login-panel');
                registerPanel.hide();
                loginPanel.show();
            }
        });
        //注册消息处理
        _message.listen(loginButton, 'REGISTER', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                //注册成功，跳转到登录页面
                var registerPanel = thisModule.findChildByKey('register-panel');
                if (registerPanel.isVisible()) {
                    var loginPanel = thisModule.findChildByKey('login-panel');
                    registerPanel.hide();
                    loginPanel.show();
                    var loginForm = thisModule.findChildByKey('login-form');
                    loginForm.setData('userEmail', msg.data.nickName);
                }
            } else {
                //登录失败
                switch (msg.flag) {
                    case 'FAILURE_USER_EMAIL_USED':
                        var infoUserEmail = thisModule.findChildByKey('register-info-user-email');
                        infoUserEmail.setLabel('邮箱已经被使用');
                        break;
                    case 'FAILURE_USER_NICK_NAME_USED':
                        var infoNickName = thisModule.findChildByKey('register-info-nick-name');
                        infoNickName.setLabel('昵称已经被使用');
                        break;
                }
            }
        });
    };
    return self;
});