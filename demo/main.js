require.config({
    packages: [
        {
            name: 'jquery',
            location: '../libs/jquery',
            main: 'jquery-1.9.1'
        },
        {
            name: 'text',
            location: '../libs/require',
            main: 'text'
        },
        {
            name: 'yy',
            location: '../libs/yy',
            main: 'yy'
        },
        {
            name: 'login',
            location: './module/login',
            main: 'login'
        }
    ],
    paths: {
        'crypto.core': '../libs/crypto/components/core',
        'crypto.md5': '../libs/crypto/components/md5',
        'jquery.mousewheel': '../libs/jquery/mousewheel/jquery.mousewheel-3.0.6',
        'jquery.datepicker': '../libs/jquery/datepicker/jquery-ui-1.10.3.datepicker'
    },
    shim: {
        'crypto.core': {
            exports: 'CryptoJS'
        },
        'crypto.md5': {
            deps: ['crypto.core'],
            exports: 'CryptoJS.MD5'
        },
        'jquery.mousewheel': {
            deps: ['jquery'],
            exports: 'jQuery.fn.mousewheel'
        },
        'jquery.datepicker': {
            deps: ['jquery'],
            exports: 'jQuery.fn.datepicker',
            init: function() {
                //加载css
                var link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = '../libs/jquery/datepicker/stylesheets/jquery-ui-1.10.3.datepicker.css';
                document.getElementsByTagName("head")[0].appendChild(link);
            }
        }
    }
});
require(['yy/module'], function(module) {
    //加载css
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = '../libs/yy//stylesheets/yy.css';
    document.getElementsByTagName("head")[0].appendChild(link);
    //加载模块
    module.loadModule('', 'login', function() {
    });
});