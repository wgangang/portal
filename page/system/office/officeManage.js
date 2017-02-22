/**
 * Created by user on 2015/12/14.
 */

saicfc.nameSpace.reg("sys.office");

(function(){
    sys.office.officeManage = function(){

        var ctxData = saicfc.utils.getServerPath("system");

        /**
         * 申明内部对象
         * @type {xqsight.cms}
         */
        var obj = this;

        var editOffice = {};

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
            editOffice.officeName = $("#officeName").val();
            editOffice.officeCode = $("#officeCode").val();
            editOffice.officeType = $("#officeType").val();
            editOffice.master = $("#master").val();
            editOffice.phone = $("#phone").val();
            editOffice.email = $("#email").val();
            editOffice.zipCode = $("#zipCode").val();
            editOffice.fax = $("#fax").val();
            editOffice.address = $("#address").val();
            editOffice.sort = $("#sort").val();
            editOffice.remark = $("#remark").val();
        };

        /**
         * 验证 function
         */
        this.validateFun = function(){
            $("#officeForm").html5Validate(function() {
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
                    if($.getUrlParam("officeId")== undefined || $.getUrlParam("officeId") =="" ){
                        url = ctxData + "/sys/office/save?date=" + new Date().getTime();
                    }else{
                        url = ctxData + "/sys/office/update?date=" + new Date().getTime();
                    }
                    $.ajax({
                        url: url ,
                        data: editOffice,
                        success: function(retData){
                            saicfc.win.alert(retData.msg,retData.status);
                            if(retData.status == "0"){
                                var iframeContent = saicfc.tab.getIframeContent();
                                iframeContent.officeMain.editCallBackFun({"officeId" : $.getUrlParam("officeId")});
                                saicfc.win.close();
                            }
                        }
                    });
                }
            };
            saicfc.win.confirm("确认提交吗？",callback);
        };

        /**
         * 取消 function
         */
        this.cancelFun = function(){
            saicfc.win.close();
        };

        /**
         * form 表单初始化数据
         */
        this.formSetValue = function(){
            var officeId = $.getUrlParam("officeId");
            if(officeId== undefined || officeId =="" ){
                editOffice.parentId = $.getUrlParam("parentId");
                return;
            }
            $.ajax({
                url: ctxData + "/sys/office/querybyid?officeId=" + officeId + "&date=" + new Date().getTime,
                success: function(retData){
                    if(retData.status == "0"){
                        var data = retData.data;
                        editOffice.officeId = data.officeId;
                        editOffice.parentId = data.parentId;

                        $("#officeName").val(data.officeName);
                        $("#officeCode").val(data.officeCode);
                        $("#officeType").selectpicker('val',data.officeType);
                        $("#master").val(data.master);
                        $("#phone").val(data.phone);
                        $("#email").val(data.email);
                        $("#zipCode").val(data.zipCode);
                        $("#fax").val(data.fax);
                        $("#address").val(data.address);
                        $("#sort").val(data.sort);
                        $("#remark").val(data.remark);
                    }
                }
            });
        };
    };

    /**
     * 初始化数据
     */
    $(document).ready(function() {
        officeManage.init();
    });
})();

var officeManage = new sys.office.officeManage();