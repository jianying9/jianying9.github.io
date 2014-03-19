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
            itemClazz: 'close_float item_list_item',
            itemDataToHtml: function(itemData) {
                var result = '<image src="' + itemData.dataUrl + '" class="float_left" width="100" height="100" />'
                        + '<div class="item_info float_left">'
                        + '<div class="item_info_point float_right">' + itemData.point + '点</div>'
                        + '<div class="item_info_title">' + itemData.itemName + '</div>'
                        + '<div class="h10 clear_float"></div>'
                        + '<div class=" item_info_desc">描述：' + itemData.desc + '</div>'
                        + '</div>'
                        + '<div class="float_right skip item_operate">'
                        + '<div id="' + itemData.itemId + '-delete-button" class="button link">删除</div>'
                        + '</div>';
                return result;
            },
            itemCompleted: function(itemCom) {
                var deleteButtonId = itemCom.key + '-delete-button';
                var deleteButton = itemCom.findChildByKey(deleteButtonId);
                _event.bind(deleteButton, 'click', function(thisCom) {
                    var msg = {
                        act: 'DELETE_ITEM',
                        itemId: itemCom.key
                    };
                    _message.send(msg);
                });
            }
        });
        //物品列表消息事件
        _message.listen(itemList, 'INSERT_ITEM', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var data = msg.data;
                thisCom.addItemDataFirst(data);
            }
        });
        _message.listen(itemList, 'DELETE_ITEM', function(thisCom, msg) {
            if (msg.flag === 'SUCCESS') {
                var itemId = msg.data.itemId;
                var itemList = thisModule.findChildByKey('item-list');
                itemList.removeItem(itemId);
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
            var infoImagePath = thisModule.findChildByKey('info-image-path');
            var file = itemForm.getFile('imagePath');
            if (file) {
                if (file.size < 10240) {
                    infoImagePath.setLabel('');
                } else {
                    validate = false;
                    infoImagePath.setLabel('图排大小不能超过10k');
                }
            } else {
                validate = false;
                infoImagePath.setLabel('请选择图片');
            }
            if (validate) {
                var fileReader = new FileReader();
                fileReader.onload = function loaded(evt) {
                    var dataUrl = evt.target.result;
                    msg.act = 'INSERT_ITEM';
                    msg.dataUrl = dataUrl;
                    _message.send(msg);
                };
                fileReader.readAsDataURL(file);
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