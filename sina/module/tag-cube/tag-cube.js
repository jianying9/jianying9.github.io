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
        var tagCubePanel = thisModule.findByKey('tag-cube-panel');
        var tagChart = _echarts.init(tagCubePanel.$this[0]);
        //
        _message.listen(tagCubePanel, 'INQUIRE_TAG_CUBE', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                if (data.length > 0) {
                    var categoryArray = new Array(data.length);
                    var valueArray = new Array(data.length);
                    var targetIndex;
                    for (var index = 0; index < data.length; index++) {
                        targetIndex = data.length - index - 1;
                        categoryArray[targetIndex] = data[index].tag;
                        valueArray[targetIndex] = data[index].num;
                    }
                    tagChart.setOption({
                        title: {
                            text: 'sina标签top20统计'
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
                        yAxis: [
                            {
                                type: 'category',
                                data: categoryArray
                            }
                        ],
                        xAxis: [
                            {
                                type: 'value',
                                splitArea: {show: true},
                                position: 'top'
                            }
                        ],
                        series: [
                            {
                                name: '标签',
                                type: 'bar',
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
        var refreshButton = thisModule.findByKey('refresh-button');
        _event.bind(refreshButton, 'click', function(thisCom) {
            _message.send({
                act: 'INQUIRE_TAG_CUBE',
                pageIndex: 1,
                pageSize: 20
            });
        });
        //页面初始化
        _message.send({
            act: 'INQUIRE_TAG_CUBE',
            pageIndex: 1,
            pageSize: 20
        });
    };
    return self;
});