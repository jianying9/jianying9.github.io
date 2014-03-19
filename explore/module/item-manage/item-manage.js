define(function(require) {
    var yy = require('yy');
    require('yy/button');
    require('yy/label');
    require('yy/form');
    require('yy/list');
    var _event = yy.getEvent();
    var _message = yy.getMessage();
    var self = {};
    self.init = function(thisModule) {
        //初始化列表
        var itemList = thisModule.findChildByKey('item-list');
        itemList.init({
            key: 'itemId',
            itemDataToHtml: function(itemData) {
                var result = '<image src="' + itemData.dataUrl + '" class="flaot_left" width="200" height="200" />'
                        + '<div class="title">' + itemData.itemName + '</div>'
                        + '<div class="h10"></div>'
                        + '<div class=" small">兑换积分:' + itemData.point + '点</div>'
                        + '<div class="h10"></div>'
                        + '<div class=" small">' + itemData.desc + '</div>';
                return result;
            }
        });
        //物品列表消息事件
        _message.listen(itemList, 'INSERT_ITEM', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                thisCom.addItemDataFirst(data);
            }
        });
        _message.listen(itemList, 'INQUIRE_ITEM', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                if (data.length < 1) {
                    //没有记录
                    if (msg.pageIndex === 1) {
                        //张开新增物品表单
                        var itemForm = thisModule.findChildByKey('item-form');
                        itemForm.show();
                    }
                } else {
                    //有记录
                    thisCom.setPageIndex(msg.pageIndex);
                    thisCom.setPageNum(msg.pageNum);
                    thisCom.setPageSize(msg.pageSize);
                    thisCom.setPageTotal(msg.pageTotal);
                    thisCom.loadData(data);
                }
            }
        });
        //
        //物品表单按钮
        var toItemFormButton = thisModule.findChildByKey('to-item-form-button');
        _event.bind(toItemFormButton, 'click', function(thisCom) {
            var itemForm = thisModule.findChildByKey('item-form');
            if (itemForm.isVisible()) {
                itemForm.hide();
            } else {
                itemForm.show();
            }
        });
        //新增物品按钮
        var insertItemButton = thisModule.findChildByKey('insert-item-button');
        _event.bind(insertItemButton, 'click', function(thisCom) {
            var itemForm = thisModule.findChildByKey('item-form');
            var msg = itemForm.getData();
            var validate = true;
            //必填检测
            var infoItemName = thisModule.findChildByKey('info-item-name');
            if (msg.itemName === '') {
                validate = false;
                infoItemName.setLabel('名称不能为空');
            } else {
                infoItemName.setLabel('');
            }
            var infoPoint = thisModule.findChildByKey('info-point');
            if (msg.point === '') {
                validate = false;
                infoPoint.setLabel('兑换点数不能为空');
            } else {
                infoPoint.setLabel('');
            }
            var infoDesc = thisModule.findChildByKey('info-desc');
            if (msg.desc === '') {
                validate = false;
                infoDesc.setLabel('描述不能为空');
            } else {
                infoDesc.setLabel('');
            }
            if (validate) {
                //判断是否要加载图片
                var file = itemForm.getFile('imagePath');
                if (file) {
                    var infoImagePath = thisModule.findChildByKey('info-image-path');
                    if (file.size < 20480) {
                        infoImagePath.setLabel('');
                        var fileReader = new FileReader();
                        fileReader.onload = function loaded(evt) {
                            var dataUrl = evt.target.result;
                            msg.act = 'INSERT_ITEM';
                            msg.dataUrl = dataUrl;
                            _message.send(msg);
                        };
                        fileReader.readAsDataURL(file);
                    } else {
                        infoImagePath.setLabel('要小于30k');
                    }
                } else {
                    msg.act = 'INSERT_ITEM';
                    msg.dataUrl = '';
                    _message.send(msg);
                }
            }
        });
        //新增物品消息处理
        _message.listen(insertItemButton, 'INSERT_ITEM', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var itemForm = thisModule.findChildByKey('item-form');
                itemForm.clear();
            }
        });
        //页面初始化
        _message.send({
            act: 'INQUIRE_ITEM',
            pageIndex: 1,
            pageSize: 6
        });
    };
    return self;
});