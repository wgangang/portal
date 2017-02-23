/**
 * Created by user on 2015/12/14.
 */

xqsight.nameSpace.reg("xqsight.cms");

(function(){
    xqsight.cms.positionManage = function(){

        var ctxData = xqsight.utils.getServerPath("cms");

        /**
         * 申明内部对象
         * @type {xqsight.cms}
         */
        var obj = this;

        var editSite = {};

        /**
         * 初始化调用 function
         */
        this.init = function() {
            //绑定事件
            $("#btn_save").bind("click",obj.validateFun);
            $("#btn_cancel").bind("click",obj.cancelFun);

            obj.formSetValue();
        };

        /**
         * 设置参数 function
         * @returns {string}
         */
        this.setParamFun = function(){
            editSite.positionName = $("#positionName").val();
            editSite.positionCode = $("#positionCode").val();
            editSite.sort = $("#sort").val();
            editSite.remark = $("#remark").val();
        };

        /**
         * 验证 function
         */
        this.validateFun = function(){
            $("#positionForm").html5Validate(function() {
                obj.saveFun();
            }, {
                validate : function() {
                    return true;
                }
            });
        };

        /**
         * 保存 function
         */
        this.saveFun = function(){
            var callback = function(btn){
                if(btn == "yes"){
                    obj.setParamFun();
                    var url = "";
                    if($.getUrlParam("positionId")== undefined || $.getUrlParam("positionId") =="" ){
                        url = ctxData + "/cms/position/save?date=" + new Date().getTime();
                    }else{
                        url = ctxData + "/cms/position/update?date=" + new Date().getTime();
                    }
                    $.ajax({
                        url : url ,
                        data : editSite,
                        success : function(retData){
                            xqsight.win.alert(retData.msg,retData.status);
                            if(retData.status == "0"){
                                var iframeContent = xqsight.tab.getCurrentIframeContent();
                                iframeContent.positionMain.editCallBackFun({"positionId" : $.getUrlParam("id")});
                                xqsight.win.close();
                            }
                        }
                    });
                }
            };
            xqsight.win.confirm("确认提交吗？",callback);
        };

        /**
         * 取消 function
         */
        this.cancelFun = function(){
            xqsight.win.close();
        };

        /**
         * form 表单初始化数据
         */
        this.formSetValue = function(){
            var positionId = $.getUrlParam("positionId");
            if(positionId== undefined || positionId =="" ){
                editSite.parentId = $.getUrlParam("parentId");
                return;
            }
            $.ajax({
                url : ctxData + "/cms/position/querybyid?positionId=" + positionId + "&date=" + new Date().getTime,
                success : function(retData){
                    if(retData.status == "0"){
                        editSite = retData.data;
                        editSite.parentId = editSite.parentId;
                        $("#positionName").val(editSite.positionName);
                        $("#positionCode").val(editSite.positionCode);
                        $("#sort").val(editSite.sort);
                        $("#remark").val(editSite.remark);
                    }
                }
            });
        }
    };

    /**
     * 初始化数据
     */
    $(document).ready(function() {
        positionManage.init();
    });
})();

var positionManage = new xqsight.cms.positionManage();