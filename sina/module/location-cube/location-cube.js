define(function(require) {
    var _yy = require('yy/yy');
    require('yy/panel');
    require('yy/button');
    var _echarts = require('echarts');
    require('echarts/chart/map');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    self.init = function(thisModule) {
        var locationCubePanel = thisModule.findByKey('location-cube-panel');
        var locationChart = _echarts.init(locationCubePanel.$this[0]);
        //
        _message.listen(locationCubePanel, 'INQUIRE_LOCATION_CUBE', function(thisCom, msg) {
            if (msg.state === 'SUCCESS') {
                var data = msg.data.list;
                if (data.length > 0) {
                    var locationArray = new Array(data.length + 1);
                    var location;
                    var num;
                    var otherName = '南海诸岛';
                    var otherValue = 0;
                    for (var index = 0; index < data.length; index++) {
                        location = data[index].location;
                        num = data[index].num;
                        if (location === '其他' || location === '海外') {
                            otherValue += num;
                        }
                        locationArray[index] = {
                            name: location,
                            value: num
                        };
                    }
                    locationArray[locationArray.length - 1] = {
                        name: otherName,
                        value: otherValue
                    };
                    locationChart.setOption({
                        title: {
                            text: 'sina地区分布统计'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: true,
                                dataView: {readOnly: false},
                                restore: true,
                                saveAsImage: true
                            }
                        },
                        dataRange: {
                            min: 0,
                            max: 800000,
                            text: ['高', '低'], // 文本，默认为数值文本
                            calculable: true
                        },
                        series: [
                            {
                                name: '地区',
                                type: 'map',
                                data: locationArray,
                                itemStyle: {
                                    normal: {label: {show: true}},
                                    emphasis: {label: {show: true}}
                                }
                            }
                        ]
                    });
                }
            }
        });
        //添加刷新按钮
        var refreshButton = thisModule.findByKey('refresh-button');
        _event.bind(refreshButton, 'click', function(thisCom) {
            _message.send({
                act: 'INQUIRE_LOCATION_CUBE',
                pageIndex: 1,
                pageSize: 50
            });
        });
        //页面初始化
        _message.send({
            act: 'INQUIRE_LOCATION_CUBE',
            pageIndex: 1,
            pageSize: 50
        });
    };
    return self;
});