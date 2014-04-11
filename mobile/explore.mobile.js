define(function(require) {
    var _yy = require('yy');
    var _utils = _yy.getUtils();
    var _cookie = _yy.getCookie();
    require('jquery.mobile');
    //
    $.mobile.defaultPageTransition = 'none';
    require('crypto.md5');
    var self = {};
    self.init = function() {
        var _httpServer = _yy.getConfig('httpServer');
        //login-page
        var $loginUserEmail = $('#login-user-email');
        var $loginPassword = $('#login-password');
        var $loginInfo = $('#login-info');
        //获取cookie
        var lastLoginName = _cookie.getCookie('lastLoginName');
        if (lastLoginName) {
            $loginUserEmail.val(lastLoginName);
        }
        var loginValidate = [
            {
                $field: $loginUserEmail,
                error: '请输入登录帐号'
            }, {
                $field: $loginPassword,
                error: '请输入登录密码'
            }
        ];
        $('#login-button').on('tap', function() {
            var error = _utils.validate(loginValidate);
            $loginInfo.text(error);
            if (error === '') {
                var userEmail = $loginUserEmail.val();
                var password = $loginPassword.val();
                password = CryptoJS.MD5(password).toString();
                $loginPassword.val('');
                var message = {
                    userEmail: userEmail,
                    password: password,
                    act: 'LOGIN'
                };
                $.getJSON(_httpServer + '?callback=?', message, function(msg) {
                    if (msg.flag === 'SUCCESS') {
                        //保存cookie
                        _cookie.setCookie('lastLoginName', userEmail, {expires: 7});
                        var data = msg.data;
                        _yy.setSession({
                            nickName: data.nickName,
                            userEmail: data.userEmail
                        });
                        $('#point-nick-name').text(data.nickName);
                        $.mobile.changePage('#point-page', {changeHash: false});
                    } else {
                        //登录失败
                        switch (msg.flag) {
                            case 'FAILURE_LOGIN_NOT_EXIST':
                                $loginInfo.text('昵称或邮箱不存在');
                                break;
                            case 'FAILURE_PASSWORD_ERROR':
                                $loginInfo.text('密码错误');
                                break;
                        }
                    }
                });
            }
        });
        $('#to-register-button').on('tap', function() {
            $.mobile.changePage('#register-page', {changeHash: false});
        });
        //register-page
        var $registerNickName = $('#register-nick-name');
        var $registerUserEmail = $('#register-user-email');
        var $registerPassword = $('#register-password');
        var $registerCheck = $('#register-check');
        var registerValidate = [
            {
                $field: $registerNickName,
                error: '请输入昵称'
            }, {
                $field: $registerUserEmail,
                error: '请输入邮箱'
            }, {
                $field: $registerPassword,
                error: '请输入密码'
            }, {
                $field: $registerCheck,
                error: '请输入重复密码'
            }
        ];
        var $registerInfo = $('#register-info');
        $('#register-button').on('tap', function() {
            var error = _utils.validate(registerValidate);
            $registerInfo.text(error);
            if (error === '') {
                //判断两次密码是否一致
                var password = $registerPassword.val();
                var check = $registerCheck.val();
                if (password === check) {
                    var nickName = $registerNickName.val();
                    var userEmail = $registerUserEmail.val();
                    password = CryptoJS.MD5(password).toString();
                    var message = {
                        nickName: nickName,
                        userEmail: userEmail,
                        password: password,
                        act: 'REGISTER'
                    };
                    $.getJSON(_httpServer + '?callback=?', message, function(msg) {
                        if (msg.flag === 'SUCCESS') {
                            //保存cookie
                            _cookie.setCookie('lastLoginName', nickName, {expires: 7});
                            $loginUserEmail.val(nickName);
                            $registerPassword.val('');
                            $registerCheck.val('');
                            //跳转
                            $.mobile.changePage('#login-page', {changeHash: false});
                        } else {
                            //登录失败
                            switch (msg.flag) {
                                case 'FAILURE_USER_EMAIL_USED':
                                    $registerInfo.text('邮箱已经被使用');
                                    break;
                                case 'FAILURE_USER_NICK_NAME_USED':
                                    $registerInfo.text('昵称已经被使用');
                                    break;
                            }
                        }
                    });
                } else {
                    $registerInfo.text('两次密码输入不一致');
                    $registerCheck.val('');
                }
            }
        });
        $('#to-login-button').on('tap', function() {
            $.mobile.changePage('#login-page', {changeHash: false});
        });
        //point-page
        
    };
    return self;
});