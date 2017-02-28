/**
 * Created by user on 2015/12/14.
 */

xqsight.nameSpace.reg("xqsight.cms");

(function () {
    xqsight.cms.jobManage = function () {
        var ctxData = xqsight.utils.getServerPath("cms");

        /**
         * 申明内部对象
         * @type {xqsight.cms}
         */
        var obj = this;

        var editJob = {};
        var jobEditor = {};

        /**
         * 初始化调用 function
         */
        this.init = function () {
            laydate({elem: '#jobStartTime', istime: true, format: 'YYYY-MM-DD hh:mm:ss'});
            laydate({elem: '#jobEndTime', istime: true, format: 'YYYY-MM-DD hh:mm:ss'});
            //绑定事件
            $("#btn_save").bind("click", obj.validateFun);
            $("#btn_cancel").bind("click", obj.cancelFun);
            obj.Editor();
            obj.formSetValue();
        };

        this.Editor = function () {
            jobEditor = new wangEditor('jobContent');
            // 上传图片
            jobEditor.config.uploadImgUrl = ctxData + '/files/core/editor';
            jobEditor.config.withCredentials = false;
            jobEditor.config.hideLinkImg = true;
            jobEditor.config.printLog = false;
            jobEditor.config.uploadParams = {
                "wangEditor": 'wangEditor'
            };
            jobEditor.config.uploadImgFns.onload = function (resultText, xhr) {
                jobEditor.command(null, 'InsertImage', resultText);
            };
            jobEditor.create();
        }

        /**
         * 设置参数 function
         * @returns {string}
         */
        this.setParamFun = function () {
            editJob.jobName = $("#jobName").val();
            editJob.jobStartTime = $("#jobStartTime").val();
            editJob.jobEndTime = $("#jobEndTime").val();
            editJob.jobPhone = $("#jobPhone").val();
            editJob.status = $("#status").val();
            editJob.jobAddress = $("#jobAddress").val();
            editJob.jobContent = jobEditor.$txt.html();
            editJob.remark = $("#remark").val();
        };

        /**
         * 验证 function
         */
        this.validateFun = function () {
            $("#jobForm").html5Validate(function () {
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
                    if ($.getUrlParam("jobId") == undefined || $.getUrlParam("jobId") == "") {
                        url = ctxData + "/cms/job/save?date=" + new Date().getTime();
                    } else {
                        url = ctxData + "/cms/job/update?date=" + new Date().getTime();
                    }
                    $.ajax({
                        url: url,
                        data: editJob,
                        success: function (retData) {
                            xqsight.win.alert(retData.msg, retData.status);
                            if (retData.status == "0") {
                                var iframeContent = xqsight.tab.getCurrentIframeContent();
                                iframeContent.jobMain.editCallBackFun({"jobId": $.getUrlParam("id")});
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
            var jobId = $.getUrlParam("jobId");
            if (jobId == undefined || jobId == "") {
                editJob.positionId = $.getUrlParam("positionId");
                return;
            }
            $.ajax({
                url: ctxData + "/cms/job/querybyid?date=" + new Date().getTime,
                data: {"jobId": jobId},
                success: function (retData) {
                    if (retData.status == "0") {
                        var data = retData.data;
                        editJob.jobId = data.jobId;
                        editJob.positionId = data.positionId;

                        $("#jobName").val(data.jobName);
                        $("#jobStartTime").val(data.jobStartTime);
                        $("#jobEndTime").val(data.jobEndTime);
                        $("#jobPhone").val(data.jobPhone);
                        $("#status").selectpicker('status', data.status);
                        $("#jobAddress").val(data.jobAddress);
                        $("#remark").val(data.remark);

                        jobEditor.$txt.html(data.jobContent);
                    }
                }
            });
        };
    };

    /**
     * 初始化数据
     */
    $(document).ready(function () {
        jobManage.init();
    });
})();

var jobManage = new xqsight.cms.jobManage();