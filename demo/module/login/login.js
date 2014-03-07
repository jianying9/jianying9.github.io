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
            msg.act = 'LOGIN';
            message.send(msg);
        });
        //登录消息处理
        message.listen(loginButton, 'LOGIN', function(thisCom, msg) {
            if(msg.flag === 'SUCCESS') {
                
            } else {
                
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
            var infoNickName = thisModule.findByKey('info-nick-name');
            if (msg.nickName === '') {
                validate = false;
                infoNickName.setLabel('昵称不能为空');
            } else {
                infoNickName.setLabel('');
            }
            var infoUserEmail = thisModule.findByKey('info-user-email');
            if (msg.userEmail === '') {
                validate = false;
                infoUserEmail.setLabel('邮箱不能为空');
            } else {
                infoUserEmail.setLabel('');
            }
            var infoPassword = thisModule.findByKey('info-password');
            if (msg.password === '') {
                validate = false;
                infoPassword.setLabel('密码不能为空');
            } else {
                infoPassword.setLabel('');
            }
            if (validate) {
                //判断密码和密码确认是否一致
                var infoCheck = thisModule.findByKey('info-check');
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
            if(msg.flag === 'SUCCESS') {
                
            } else {
                
            }
        });
    };
    return self;
});