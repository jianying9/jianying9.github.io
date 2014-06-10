define(function(require) {
    var _yy = require('yy');
    require('yy/panel');
    require('yy/button');
    var _echarts = require('echarts');
    require('echarts/chart/pie');
    require('echarts/chart/bar');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    self.init = function(thisModule) {
        var genderCubePanel = thisModule.findByKey('gender-cube-panel');
        var genderChart = _echarts.init(genderCubePanel.$this[0]);
        genderChart.setOption({
            title: {
                text: 'sina性别统计',
                x: 'center'
            },
            tooltip: {
                show: false
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['男', '女']
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
            calculable: true
        });

        _message.listen(genderCubePanel, 'INQUIRE_GENDER_CUBE', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                if (data.length > 0) {
                    var pieChartArray = new Array(data.length);
                    for (var index = 0; index < data.length; index++) {
                        pieChartArray[index] = {
                            name: data[index].gender,
                            value: data[index].num
                        };
                    }
                    genderChart.setSeries([{
                            name: '性别百分比',
                            type: 'pie',
                            center: ['50%', '50%'],
                            radius: '50%',
                            itemStyle: {
                                normal: {
                                    label: {
                                        formatter: function(a, b, c, d) {
                                            return c + '人,' + d + '%';
                                        }
                                    }
                                }
                            },
                            data: pieChartArray
                        }
                    ], true);
                }
            }
        });
        //添加刷新按钮
        var refreshButton = thisModule.findByKey('refresh-button');
        _event.bind(refreshButton, 'click', function(thisCom) {
            _message.send({
                act: 'INQUIRE_GENDER_CUBE'
            });
        });
        //页面初始化
        _message.send({
            act: 'INQUIRE_GENDER_CUBE'
        });
    };
    return self;
});