define(function(require) {
    var yy = require('yy');
    require('yy/panel');
    require('yy/form');
    require('yy/button');
    var self = {};
    var event = yy.getEvent();
    var message = yy.getMessage();
    self.init = function(thisModule) {
        //登录按钮
        var loginButton = thisModule.findByKey('login-button');
        event.bind(loginButton, 'click', function(thisCom) {
            var loginForm = thisModule.findByKey('login-form');
            var msg = loginForm.getData();
            msg.act = 'LOGIN';
            message.send(msg);
        });
        //切换到登录页面按钮
        var toLoginButton = thisModule.findByKey('to-login-button');
        event.bind(toLoginButton, 'click', function(thisCom) {
            var registerPanel = thisModule.findByKey('register-panel');
            if (registerPanel.isVisible()) {
                var loginPanel = thisModule.findByKey('login-panel');
                registerPanel.hide();
                loginPanel.show();
            }
        });
        //切换到注册页面按钮
        var toRegisterButton = thisModule.findByKey('to-register-button');
        event.bind(toRegisterButton, 'click', function(thisCom) {
            var loginPanel = thisModule.findByKey('login-panel');
            if (loginPanel.isVisible()) {
                var registerPanel = thisModule.findByKey('register-panel');
                loginPanel.hide();
                registerPanel.show();
            }
        });
        //注册按钮
    };
    return self;
});