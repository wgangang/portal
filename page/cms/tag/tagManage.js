/**
 * Created by user on 2015/12/14.
 */

xqsight.nameSpace.reg("xqsight.cms");

(function () {
    xqsight.cms.tagManage = function () {
        var ctxData = xqsight.utils.getServerPath("cms");

        /**
         * 申明内部对象
         * @type {xqsight.cms}
         */
        var obj = this;

        var editTag = {};

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
            editTag.tagName = $("#tagName").val();
            editTag.tagType = $("#tagType").val();
            editTag.remark = $("#remark").val();
        };

        /**
         * 验证 function
         */
        this.validateFun = function () {
            $("#tagForm").html5Validate(function () {
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
                    if ($.getUrlParam("tagId") == undefined || $.getUrlParam("tagId") == "") {
                        url = ctxData + "/cms/tag/save?date=" + new Date().getTime();
                    } else {
                        url = ctxData + "/cms/tag/update?date=" + new Date().getTime();
                    }
                    $.ajax({
                        url: url,
                        data: editTag,
                        success: function (retData) {
                            xqsight.win.alert(retData.msg, retData.status);
                            if (retData.status == "0") {
                                var iframeContent = xqsight.tab.getCurrentIframeContent();
                                iframeContent.tagMain.editCallBackFun({"tagId": $.getUrlParam("id")});
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
            var tagId = $.getUrlParam("tagId");
            if (tagId == undefined || tagId == "") {
                return;
            }
            $.ajax({
                url: ctxData + "/cms/tag/querybyid?date=" + new Date().getTime,
                data: {"tagId": tagId},
                success: function (retData) {
                    if (retData.status == "0") {
                        var data = retData.data;
                        editTag.tagId = data.tagId;
                        $("#tagName").val(data.tagName);
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
        tagManage.init();
    });
})();

var tagManage = new xqsight.cms.tagManage();