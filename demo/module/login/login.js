define(function(require) {
    var yy = require('yy');
    require('yy/form');
    require('yy/button');
    var self = {};
    var event = yy.getEvent();
    var components = yy.getComponents();
    self.init = function(thisModule) {
        var loginButton = components.findByKey(thisModule.loaderId, 'login-button');
        event.bind(loginButton, 'click', function(thisCom) {
            alert(thisCom.id);
        });
    };
    return self;
});