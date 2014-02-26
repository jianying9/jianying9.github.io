require.config({
    packages: [
        {
            name: 'jquery',
            location: '../../libs/jquery',
            main: 'jquery-1.9.1'
        },
        {
            name: 'text',
            location: '../../libs/require',
            main: 'text'
        },
        {
            name: 'temp',
            location: 'module/temp',
            main: 'temp'
        },
        {
            name: 'yy',
            location: '../../libs/yy',
            main: 'yy'
        }
    ],
    paths: {
        'crypto.core': '../../libs/crypto/components/core',
        'crypto.md5': '../../libs/crypto/components/md5',
        'jquery.mousewheel': '../../libs/jquery/mousewheel/jquery.mousewheel-3.0.6',
        'jquery.datepicker': '../../libs/jquery/datepicker/jquery-ui-1.10.3.datepicker'
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
                link.href = '../../libs/jquery/datepicker/stylesheets/jquery-ui-1.10.3.datepicker.css';
                document.getElementsByTagName("head")[0].appendChild(link);
            }
        }
    }
});
//require(['jquery'], function(jquery) {
//    alert(jquery);
//});
//require(['text!temp/temp.html'], function(temp) {
//    alert(temp);
//});
//require(['crypto.md5'], function() {
//    var hash = CryptoJS.MD5("Message");
//    alert(hash);
//});
//require(['jquery.mousewheel'], function() {
//    $('body').mousewheel(function(event, delta, deltaX, deltaY) {
//        console.log('当前坐标x:' + deltaX + ',y:' + deltaY);
//    });
//});

//require(['jquery.datepicker'], function() {
//    $('#testInput').datepicker();
//});
//require(['yy'], function(yy) {
//    alert(yy);
//});

//require(['temp'], function(temp) {
//    alert(temp.getName());
//});
require(['yy'], function(yy) {
    yy.loadModule('', 'temp', function(temp){
        alert(temp.getName());
    });
});