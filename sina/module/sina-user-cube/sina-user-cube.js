define(function(require) {
    var _yy = require('yy');
    require('yy/panel');
    require('yy/button');
    var _echarts = require('echarts');
    require('echarts/chart/bar');
    require('echarts/chart/line');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    self.init = function(thisModule) {
        var sinaUserCubePanel = thisModule.findChildByKey('sina-user-cube-panel');
        var sinaUserChart = _echarts.init(sinaUserCubePanel.$this[0]);
        //
        _message.listen(sinaUserCubePanel, 'INQUIRE_SINA_USER_CUBE', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                if (data.length > 0) {
                    var categoryArray = new Array(data.length);
                    var valueArray = new Array(data.length);
                    var targetIndex;
                    var newTime;
                    for (var index = 0; index < data.length; index++) {
                        targetIndex = data.length - index - 1;
                        newTime = data[index].time.substring(11, 13) + ':00';
                        categoryArray[targetIndex] = newTime;
                        valueArray[targetIndex] = data[index].num;
                    }
                    sinaUserChart.setOption({
                        title: {
                            text: 'sina用户近24小时增长统计'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark : true,
                                dataView: {readOnly: false},
                                magicType: ['line', 'bar'],
                                restore: true,
                                saveAsImage: true
                            }
                        },
                        calculable: true,
                        xAxis: [
                            {
                                type: 'category',
                                data: categoryArray
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                splitArea: {show: true},
                                scale: true
                            }
                        ],
                        series: [
                            {
                                name: '用户数',
                                type: 'line',
                                data: valueArray,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true
                                        }
                                    }
                                }
                            }
                        ]
                    });
                }
            }
        });
        //添加刷新按钮
        var refreshButton = thisModule.findChildByKey('refresh-button');
        _event.bind(refreshButton, 'click', function(thisCom) {
            _message.send({
                act: 'INQUIRE_SINA_USER_CUBE',
                pageIndex: 1,
                pageSize: 24
            });
        });
        //页面初始化
        _message.send({
            act: 'INQUIRE_SINA_USER_CUBE',
            pageIndex: 1,
            pageSize: 24
        });
    };
    return self;
});