/**
 * Created by user on 2015/12/14.
 */

xqsight.nameSpace.reg("sys.dict");

(function(){
    sys.dict.dictManage = function(){

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
            editMenu.dictName = $("#dictName").val();
            editMenu.dictCode = $("#dictCode").val();
            editMenu.dictValue = $("#dictValue").val();
            editMenu.sort = $("#sort").val();
            editMenu.remark = $("#remark").val();
        };

        /**
         * 验证 function
         */
        this.validateFun = function(){
            $("#dictForm").html5Validate(function() {
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
                    if($.getUrlParam("dictId")== undefined || $.getUrlParam("dictId") =="" ){
                        url = ctxData + "/sys/dict/save?date=" + new Date().getTime();
                    }else{
                        url = ctxData + "/sys/dict/update?date=" + new Date().getTime();
                    }
                    $.ajax({
                        url: url,
                        data: editMenu,
                        success: function(retData){
                            xqsight.win.alert(retData.msg,retData.status);
                            if(retData.status == "0"){
                                var iframeContent = xqsight.tab.getIframeContent();
                                iframeContent.dictMain.editCallBackFun({"dictId" : $.getUrlParam("id")});
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
            var dictId = $.getUrlParam("dictId");
            if(dictId == undefined || dictId =="" ){
                editMenu.parentId = $.getUrlParam("parentId");
                return;
            }
            $.ajax({
                url: ctxData + "/sys/dict/querybyid?dictId=" + dictId + "&date=" + new Date().getTime(),
                success: function(retData){
                    if(retData.status == "0"){
                        var data = retData.data;
                        editMenu.dictId = data.dictId;
                        editMenu.parentId = data.parentId;
                        
                        $("#dictName").val(data.dictName);
                        $("#dictCode").val(data.dictCode);
                        $("#dictValue").val(data.dictValue);
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
        dictManage.init();
    });
})();

var dictManage = new sys.dict.dictManage();





