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
        var numCubePanel = thisModule.findByKey('num-cube-panel');
        var numChart = _echarts.init(numCubePanel.$this[0]);
        var incrementCubePanel = thisModule.findByKey('increment-cube-panel');
        var incrementChart = _echarts.init(incrementCubePanel.$this[0]);
        //
        _message.listen(numCubePanel, 'INQUIRE_SINA_USER_CUBE', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                if (data.length > 0) {
                    var categoryArray = new Array(data.length);
                    var numArray = new Array(data.length);
                    var incrementArray = new Array(data.length);
                    var targetIndex;
                    var newTime;
                    for (var index = 0; index < data.length; index++) {
                        targetIndex = data.length - index - 1;
                        newTime = data[index].time.substring(11, 13) + ':00';
                        categoryArray[targetIndex] = newTime;
                        numArray[targetIndex] = data[index].num;
                        incrementArray[targetIndex] = data[index].increment;
                    }
                    numChart.setOption({
                        title: {
                            text: '近24小时sina用户总数统计'
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
                                name: '用户总数',
                                type: 'line',
                                data: numArray,
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
                    incrementChart.setOption({
                        title: {
                            text: '近24小时sina用户数变化统计'
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
                                name: '增量',
                                type: 'line',
                                data: incrementArray,
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
        var refreshButton = thisModule.findByKey('refresh-button');
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