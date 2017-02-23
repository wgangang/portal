/**
 * Created by user on 2015/12/14.
 */

xqsight.nameSpace.reg("sys.area");

(function(){
    sys.area.areaManage = function(){

        var ctxData = xqsight.utils.getServerPath("system");

        var editMenu = {};

        /**
         * 申明内部对象
         * @type {xqsight.pmpf}
         */
        var obj = this;

        /**
         * 初始化调用 function
         */
        this.init = function() {
            $("#btn_save").on("click",obj.validateFun);
            $("#btn_cancel").on("click",obj.cancelFun);

            obj.formSetValue();
        };

        /**
         * 设置参数 function
         * @returns {string}
         */
        this.setParamFun = function(){
            editMenu.areaName = $("#areaName").val();
            editMenu.areaCode = $("#areaCode").val();
            editMenu.sort = $("#sort").val();
            editMenu.remark = $("#remark").val();
        };

        /**
         * 验证 function
         */
        this.validateFun = function(){
            $("#areaForm").html5Validate(function() {
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
                    if($.getUrlParam("areaId")== undefined || $.getUrlParam("areaId") =="" ){
                        url = ctxData + "/sys/area/save?date=" + new Date().getTime();
                    }else{
                        url = ctxData + "/sys/area/update?date=" + new Date().getTime();
                    }
                    $.ajax({
                        url: url,
                        data: editMenu,
                        success: function(retData){
                            xqsight.win.alert(retData.msg,retData.status);
                            if(retData.status == "0"){
                                var iframeContent = xqsight.tab.getIframeContent();
                                iframeContent.areaMain.editCallBackFun({"areaId" : $.getUrlParam("id")});
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
            var areaId = $.getUrlParam("areaId");
            if(areaId == undefined || areaId =="" ){
                editMenu.parentId = $.getUrlParam("parentId");
                return;
            }
            $.ajax({
                url: ctxData + "/sys/area/querybyid?areaId=" + areaId + "&date=" + new Date().getTime(),
                success: function(retData){
                    if(retData.status == "0"){
                        var data = retData.data;
                        editMenu.areaId = data.areaId;
                        editMenu.parentId = data.parentId;
                        
                        $("#areaName").val(data.areaName);
                        $("#areaCode").val(data.areaCode);
                        $("#sort").val(data.sort);
                        $("#remark").val(data.remark);
                    }
                }
            });


        }
    };

    /**
     * 初始化数据
     */
    $(document).ready(function() {
        areaManage.init();
    });
})();

var areaManage = new sys.area.areaManage();





