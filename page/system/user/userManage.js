/**
 * Created by user on 2015/12/14.
 */

xqsight.nameSpace.reg("sys.user");

var layIndex;

(function(){
    sys.user.userManage = function(){

        var ctxData = xqsight.utils.getServerPath("system");

        /**
         * 申明内部对象
         * @type {xqsight.pmpf}
         */
        var obj = this;
        var editUser = {};
        /**
         * 初始化调用 function
         */
        this.init = function() {
            laydate({elem: '#userBorn', format: 'YYYY-MM-DD'});
            //绑定事件
            $("#btn_save").bind("click",obj.validateFun);
            $("#btn_cancel").bind("click",obj.cancelFun);
            //归属区域
            $("#companyId").ComboBoxTree({
                url: ctxData + "/sys/area/querytree?date="+new Date().getTime(),
                description: "==请选择==",
                height: "195px",
                allowSearch: false
            });
            //归属区域
            $("#departmentId").ComboBoxTree({
                url: ctxData + "/sys/area/querytree?date="+new Date().getTime(),
                description: "==请选择==",
                height: "195px",
                allowSearch: false
            });
            $("#btn-upload-pic").on("click",function(){
                layIndex = layer.open({
                    type: 2,
                    title: '<i class="ace-icon fa fa-edit"></i>  选择图片',
                    shadeClose: false,
                    shade: 0.2,
                    shift: 1,
                    skin: "layui-layer-molv",
                    moveOut: true,
                    offset: "10px",
                    maxmin: true, //开启最大化最小化按钮
                    area: [$(window).width()-500 + 'px', $(window).height()-100 + 'px'],
                    content: "../../component/cropper/cropper.html"
                })
            });
            obj.formSetValue();
        };

        /**
         * 设置参数 function
         * @returns {string}
         */
        this.setParamFun = function(){
            editUser.userName= $("#userName").val();
            editUser.loginId= $("#loginId").val();
            editUser.locked= $("#locked").val();
            editUser.remark= $("#remark").val();
        };

        /**
         * 验证 function
         */
        this.validateFun = function(){
            $("#userForm").html5Validate(function() {
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
                    $.ajax({
                        "url": ctxData + "/sys/login/save?date=" + new Date().getTime(),
                        "data": editUser,
                        "success": function(retData){
                            xqsight.win.alert(retData.msg,retData.status);
                            if(retData.status == "0"){
                                xqsight.win.alert("您的默认密码是:!password");
                                var iframeContent = xqsight.tab.getCurrentIframeContent();
                                iframeContent.userMain.editCallBackFun({"userId" : $.getUrlParam("id")});
                                xqsight.win.close();
                            }
                        },
                        "dataType": "jsonp",
                        "cache": false
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
            var id = $.getUrlParam("id");
            if(id == undefined || id == "" ){
                editUser.orgId = $.getUrlParam("orgId");
                return;
            }
            $.ajax({
                "dataType": "jsonp",
                "cache": false,
                "url": ctxData + "/sys/login/querybyid?id=" + id + "&date=" + new Date().getTime,
                "success": function(retData){
                    if(retData.status == "0"){
                        var data = retData.data;
                        editUser.id = data.id;
                        editUser.orgId = data.orgId;

                        $("#userName").val(data.userName);
                        $("#loginId").val(data.loginId);
                        $("#locked").val(data.locked);
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
        userManage.init();
    });
})();

var userManage = new sys.user.userManage();

var _imgCallBack = function(data){
    $("#userImage").val(data);
    $("#imgUrl").attr("src",data);
    layer.close(layIndex)
}



