define(function(require) {
    var yy = require('yy');
    require('yy/form');
    require('yy/button');
    var self = {};
    var event = yy.getEvent();
    var components = yy.getComponents();
    var message = yy.getMessage();
    self.init = function(thisModule) {
        var loginButton = components.findByKey(thisModule.loaderId, 'login-button');
        event.bind(loginButton, 'click', function(thisCom) {
            var loginForm = components.findByKey(thisModule.loaderId, 'login-form');
            var msg = loginForm.getData();
            msg.act = 'LOGIN';
            message.send(msg);
        });
    };
    return self;
});