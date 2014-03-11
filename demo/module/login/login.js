define(function(require) {
    var yy = require('yy');
    require('yy/panel');
    require('yy/form');
    require('yy/button');
    require('yy/label');
    var self = {};
    var event = yy.getEvent();
    var message = yy.getMessage();
    self.init = function(thisModule) {
        //登录按钮事件处理
        var loginButton = thisModule.findByKey('login-button');
        event.bind(loginButton, 'click', function(thisCom) {
            var loginForm = thisModule.findByKey('login-form');
            var msg = loginForm.getData();
            var validate = true;
            //必填检测
            var infoUserEmail = thisModule.findByKey('login-info-user-email');
            if (msg.userEmail === '') {
                validate = false;
                infoUserEmail.setLabel('邮箱不能为空');
            } else {
                infoUserEmail.setLabel('');
            }
            var infoPassword = thisModule.findByKey('login-info-password');
            if (msg.password === '') {
                validate = false;
                infoPassword.setLabel('密码不能为空');
            } else {
                infoPassword.setLabel('');
            }
            if (validate) {
                msg.act = 'LOGIN';
                message.send(msg);
            }
        });
        //登录消息处理
        message.listen(loginButton, 'LOGIN', function(thisCom, msg) {
            var info = thisModule.findByKey('login-info');
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
        var toLoginButton = thisModule.findByKey('to-login-button');
        event.bind(toLoginButton, 'click', function(thisCom) {
            var registerPanel = thisModule.findByKey('register-panel');
            if (registerPanel.isVisible()) {
                var loginPanel = thisModule.findByKey('login-panel');
                registerPanel.hide();
                loginPanel.show();
            }
        });
        //切换到注册页面按钮事件处理
        var toRegisterButton = thisModule.findByKey('to-register-button');
        event.bind(toRegisterButton, 'click', function(thisCom) {
            var loginPanel = thisModule.findByKey('login-panel');
            if (loginPanel.isVisible()) {
                var registerPanel = thisModule.findByKey('register-panel');
                loginPanel.hide();
                registerPanel.show();
            }
        });
        //注册按钮事件处理
        var registerButton = thisModule.findByKey('register-button');
        event.bind(registerButton, 'click', function(thisCom) {
            var registerForm = thisModule.findByKey('register-form');
            var msg = registerForm.getData();
            var validate = true;
            //必填检测
            var infoNickName = thisModule.findByKey('register-info-nick-name');
            if (msg.nickName === '') {
                validate = false;
                infoNickName.setLabel('昵称不能为空');
            } else {
                infoNickName.setLabel('');
            }
            var infoUserEmail = thisModule.findByKey('register-info-user-email');
            if (msg.userEmail === '') {
                validate = false;
                infoUserEmail.setLabel('邮箱不能为空');
            } else {
                infoUserEmail.setLabel('');
            }
            var infoPassword = thisModule.findByKey('register-info-password');
            if (msg.password === '') {
                validate = false;
                infoPassword.setLabel('密码不能为空');
            } else {
                infoPassword.setLabel('');
            }
            if (validate) {
                //判断密码和密码确认是否一致
                var infoCheck = thisModule.findByKey('register-info-check');
                if (msg.password === msg.check) {
                    infoCheck.setLabel('');
                    //一致
                    msg.act = 'REGISTER';
                    message.send(msg);
                } else {
                    //不一致
                    registerForm.setData('check', '');
                    infoCheck.setLabel('密码不一致');
                }
            }
        });
        //注册消息处理
        message.listen(loginButton, 'REGISTER', function(thisCom, msg) {
            var info = thisModule.findByKey('register-info');
            if (msg.flag === 'SUCCESS') {
                //注册成功，跳转到登录页面
                var registerPanel = thisModule.findByKey('register-panel');
                if (registerPanel.isVisible()) {
                    var loginPanel = thisModule.findByKey('login-panel');
                    registerPanel.hide();
                    loginPanel.show();
                    var loginForm = thisModule.findByKey('login-form');
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