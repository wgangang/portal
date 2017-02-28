/**
 * Created by user on 2015/12/14.
 */

xqsight.nameSpace.reg("xqsight.cms");

(function () {
    xqsight.cms.modelManage = function () {
        var ctxData = xqsight.utils.getServerPath("cms");

        /**
         * 申明内部对象
         * @type {xqsight.cms}
         */
        var obj = this;

        var editModel = {};

        /**
         * 初始化调用 function
         */
        this.init = function () {
            //绑定事件
            $("#btn_save").bind("click", obj.validateFun);
            $("#btn_cancel").bind("click", obj.cancelFun);
            obj.formSetValue();
        };

        /**
         * 设置参数 function
         * @returns {string}
         */
        this.setParamFun = function () {
            editModel.modelName = $("#modelName").val();
            editModel.modelCode = $("#modelCode").val();
            editModel.remark = $("#remark").val();
        };

        /**
         * 验证 function
         */
        this.validateFun = function () {
            $("#modelForm").html5Validate(function () {
                obj.saveFun();
            }, {
                validate: function () {
                    return true;
                }
            });
        };

        /**
         * 保存 function
         */
        this.saveFun = function () {
            var callback = function (btn) {
                if (btn == "yes") {
                    obj.setParamFun();
                    var url = "";
                    if ($.getUrlParam("modelId") == undefined || $.getUrlParam("modelId") == "") {
                        url = ctxData + "/cms/model/save?date=" + new Date().getTime();
                    } else {
                        url = ctxData + "/cms/model/update?date=" + new Date().getTime();
                    }
                    $.ajax({
                        url: url,
                        data: editModel,
                        success: function (retData) {
                            xqsight.win.alert(retData.msg, retData.status);
                            if (retData.status == "0") {
                                var iframeContent = xqsight.tab.getCurrentIframeContent();
                                iframeContent.modelMain.editCallBackFun({"modelId": $.getUrlParam("id")});
                                xqsight.win.close();
                            }
                        }
                    });
                }
            };
            xqsight.win.confirm("确认提交吗？", callback);
        };

        /**
         * 取消 function
         */
        this.cancelFun = function () {
            xqsight.win.close();
        };

        /**
         * form 表单初始化数据
         */
        this.formSetValue = function () {
            var modelId = $.getUrlParam("modelId");
            if (modelId == undefined || modelId == "") {
                editModel.siteId = $.getUrlParam("siteId");
                return;
            }
            $.ajax({
                url: ctxData + "/cms/model/querybyid?date=" + new Date().getTime,
                data: {"modelId": modelId},
                success: function (retData) {
                    if (retData.status == "0") {
                        var data = retData.data;
                        editModel.modelId = data.modelId;
                        editModel.siteId = data.siteId;

                        $("#modelName").val(data.modelName);
                        $("#modelCode").val(data.modelCode);
                        $("#remark").val(data.remark);
                    }
                }
            });
        };
    };

    /**
     * 初始化数据
     */
    $(document).ready(function () {
        modelManage.init();
    });
})();

var modelManage = new xqsight.cms.modelManage();