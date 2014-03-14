define(function(require) {
    var yy = require('yy');
    require('yy/panel');
    require('yy/form');
    require('yy/button');
    require('yy/label');
    var self = {};
    var _event = yy.getEvent();
    var _message = yy.getMessage();
    var _cookie = yy.getCookie();
    self.init = function(thisModule) {
        //获取url参数
        var urlPara = yy.getUrlPara();
        var panel = urlPara.panel;
        var promoter = urlPara.promoter;
        if(panel && panel === 'register') {
            //注册
        } else {
            //登录
        }
        //获取cookie
        var lastLoginName = _cookie.getCookie('lastLoginName');
        if (lastLoginName) {
            var loginForm = thisModule.findChildByKey('login-form');
            loginForm.setData('userEmail', lastLoginName);
        }
        //登录按钮事件处理
        var loginButton = thisModule.findChildByKey('login-button');
        _event.bind(loginButton, 'click', function(thisCom) {
            var loginForm = thisModule.findChildByKey('login-form');
            var msg = loginForm.getData();
            var validate = true;
            //必填检测
            var infoUserEmail = thisModule.findChildByKey('login-info-user-email');
            if (msg.userEmail === '') {
                validate = false;
                infoUserEmail.setLabel('邮箱不能为空');
            } else {
                infoUserEmail.setLabel('');
            }
            var infoPassword = thisModule.findChildByKey('login-info-password');
            if (msg.password === '') {
                validate = false;
                infoPassword.setLabel('密码不能为空');
            } else {
                infoPassword.setLabel('');
            }
            if (validate) {
                msg.act = 'LOGIN';
                _message.send(msg);
                loginForm.setData('password', '');
                //保存cookie
                _cookie.setCookie('lastLoginName', msg.userEmail, {expires: 30});
            }
        });
        //登录消息处理
        _message.listen(loginButton, 'LOGIN', function(thisCom, msg) {
            var info = thisModule.findChildByKey('login-info');
            if (msg.flag === 'SUCCESS') {
                //登录成功，跳转
                info.setLabel('登录成功，自动跳转。。。');
            } else {
                //登录失败
                switch (msg.flag) {
                    case 'FAILURE_LOGIN_NOT_EXIST':
                        info.setLabel('昵称或邮箱表存在');
                        break;
                    case 'FAILURE_PASSWORD_ERROR':
                        info.setLabel('密码错误');
                        break;
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
        //注册按钮事件处理
        var registerButton = thisModule.findChildByKey('register-button');
        _event.bind(registerButton, 'click', function(thisCom) {
            var registerForm = thisModule.findChildByKey('register-form');
            var msg = registerForm.getData();
            var validate = true;
            //必填检测
            var infoNickName = thisModule.findChildByKey('register-info-nick-name');
            if (msg.nickName === '') {
                validate = false;
                infoNickName.setLabel('昵称不能为空');
            } else {
                infoNickName.setLabel('');
            }
            var infoUserEmail = thisModule.findChildByKey('register-info-user-email');
            if (msg.userEmail === '') {
                validate = false;
                infoUserEmail.setLabel('邮箱不能为空');
            } else {
                infoUserEmail.setLabel('');
            }
            var infoPassword = thisModule.findChildByKey('register-info-password');
            if (msg.password === '') {
                validate = false;
                infoPassword.setLabel('密码不能为空');
            } else {
                infoPassword.setLabel('');
            }
            if (validate) {
                //判断密码和密码确认是否一致
                var infoCheck = thisModule.findChildByKey('register-info-check');
                if (msg.password === msg.check) {
                    infoCheck.setLabel('');
                    //一致
                    msg.act = 'REGISTER';
                    _message.send(msg);
                } else {
                    //不一致
                    registerForm.setData('check', '');
                    infoCheck.setLabel('密码不一致');
                }
            }
        });
        //注册消息处理
        _message.listen(loginButton, 'REGISTER', function(thisCom, msg) {
            var info = thisModule.findChildByKey('register-info');
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
                        info.setLabel('邮箱已经被使用');
                        break;
                    case 'FAILURE_USER_NICK_NAME_USED':
                        info.setLabel('昵称已经被使用');
                        break;
                }
            }
        });
    };
    return self;
});