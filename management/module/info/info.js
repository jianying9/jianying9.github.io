define(function(require) {
    var _yy = require('yy');
    require('yy/label');
    require('yy/form');
    require('yy/button');
    require('yy/list');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    var _utils = _yy.getUtils();
    self.init = function(thisModule) {
        var actionName = _yy.getSession('actionName');
        //
        var requestList = thisModule.findChildByKey('request-list');
        requestList.init({
            key: 'name',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                var result = '<div>' + itemData.must + '</div>'
                        + '<div>' + itemData.name + '</div>'
                        + '<div>' + itemData.type + '</div>'
                        + '<div>' + itemData.desc + '</div>';
                return result;
            }
        });
        //
        var responseList = thisModule.findChildByKey('response-list');
        responseList.init({
            key: 'name',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                var result = '<div>' + itemData.name + '</div>'
                        + '<div>' + itemData.type + '</div>'
                        + '<div>' + itemData.desc + '</div>';
                return result;
            }
        });
        //
        _message.listen(thisModule, 'WOLF_INQUIRE_SERVICE_INFO', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                var actionNameLabel = thisModule.findChildByKey('action-name-label');
                actionNameLabel.setLabel(data.actionName);
                var descriptionLabel = thisModule.findChildByKey('description-label');
                descriptionLabel.setLabel(data.desc);
                //
                requestList.loadData(data.requestConfigs);
                //
                responseList.loadData(data.responseConfigs);
                //动态渲染测试表单
                var testRequestForm = thisModule.findChildByKey('test-request-form');
                var inputHtml = '';
                for (var index = 0; index < data.requestConfigs.length; index++) {
                    inputHtml += '<div class="form_label">' + data.requestConfigs[index].name + ':</div>'
                            + '<input name="' + data.requestConfigs[index].name + '" value="" />';
                }
                testRequestForm.$this.append(inputHtml);
                testRequestForm.init();
                //
                var actionName = _yy.getSession('actionName');
                var testResponseForm = thisModule.findChildByKey('test-response-form');
                var _parse = function(json, indent) {
                    var result = '';
                    var type = typeof json;
                    switch (type) {
                        case 'object':
                            var thisTab = '';
                            var childTab = '';
                            for (var index = 0; index < indent; index++) {
                                childTab += '  ';
                            }
                            for (var index = 0; index < indent - 1; index++) {
                                thisTab += '  ';
                            }
                            result += '{\n';
                            for (var id in json) {
                                result += childTab + '\"' + id + '\":' + _parse(json[id], indent + 1) + ',\n';
                            }
                            result = result.substr(0, result.length - 2);
                            result += '\n' + thisTab + '}';
                            break;
                        case 'number':
                            result = json;
                            break;
                        case 'string':
                            result = '\"' + json + '\"';
                            break;
                        case 'array':
                            result += '[\n';
                            var type;
                            for (var index = 0; index < json.length; index++) {
                                type = typeof json[index];
                                switch (type) {
                                    case 'object':
                                        result += tab + _parse(json[index], indent + 1) + ',\n';
                                        break;
                                    case 'number':
                                        result += json[index] + ',\n';
                                        break;
                                    case 'string':
                                        result += '\"' + json[index] + '\",\n';
                                        break;
                                }
                            }
                            result = result.substr(0, result.length - 2);
                            result += ']\n';
                            break;
                    }
                    return result;
                };
                _message.listen(testResponseForm, actionName, function(thisCom, msg) {
                    var responseData = _parse(msg, 1);
                    thisCom.setData('responseData', responseData);
                });
                //
                var testButton = thisModule.findChildByKey('test-button');
                _event.bind(testButton, 'click', function(thisCom) {
                    var msg = testRequestForm.getData();
                    var actionName = _yy.getSession('actionName');
                    msg.act = actionName;
                    _message.send(msg);
                });
            }
        });
        //页面初始化
        _message.send({
            act: 'WOLF_INQUIRE_SERVICE_INFO',
            actionName: actionName
        });
    };
    return self;
});