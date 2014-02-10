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
        }
    ],
    paths: {
        'crypto.core': '../../libs/crypto/components/core',
        'crypto.md5': '../../libs/crypto/components/md5'
    },
    shim: {
        'crypto.core': {
            exports: 'CryptoJS'
        },
        'crypto.md5': {
            deps: ['crypto.core'],
            exports: 'CryptoJS.MD5'
        }
    }
});
require(['jquery'], function(jquery) {
    alert(jquery);
});
require(['text!temp.html'], function(temp) {
    alert(temp);
});
require(['crypto.md5'], function() {
    var hash = CryptoJS.MD5("Message");
    alert(hash);
});

