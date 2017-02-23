/**
 * Created by user on 2015/12/14.
 */

xqsight.nameSpace.reg("xqsight.cms");

(function(){
    xqsight.cms.siteManage = function(){

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
            editSite.siteName = $("#siteName").val();
            editSite.siteCode = $("#siteCode").val();
            editSite.sort = $("#sort").val();
            editSite.remark = $("#remark").val();
        };

        /**
         * 验证 function
         */
        this.validateFun = function(){
            $("#siteForm").html5Validate(function() {
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
                    if($.getUrlParam("siteId")== undefined || $.getUrlParam("siteId") =="" ){
                        url = ctxData + "/cms/site/save?date=" + new Date().getTime();
                    }else{
                        url = ctxData + "/cms/site/update?date=" + new Date().getTime();
                    }
                    $.ajax({
                        url : url ,
                        data : editSite,
                        success : function(retData){
                            xqsight.win.alert(retData.msg,retData.status);
                            if(retData.status == "0"){
                                var iframeContent = xqsight.tab.getCurrentIframeContent();
                                iframeContent.siteMain.editCallBackFun({"siteId" : $.getUrlParam("id")});
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
            var siteId = $.getUrlParam("siteId");
            if(siteId== undefined || siteId =="" ){
                editSite.parentId = $.getUrlParam("parentId");
                return;
            }
            $.ajax({
                url : ctxData + "/cms/site/querybyid?siteId=" + siteId + "&date=" + new Date().getTime,
                success : function(retData){
                    if(retData.status == "0"){
                        editSite = retData.data;
                        editSite.parentId = editSite.parentId;
                        $("#siteName").val(editSite.siteName);
                        $("#siteCode").val(editSite.siteCode);
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
        siteManage.init();
    });
})();

var siteManage = new xqsight.cms.siteManage();