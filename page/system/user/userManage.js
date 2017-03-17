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
            $("#officeId").ComboBoxTree({
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
            editUser.companyId= $("#companyId").attr("data-value");
            editUser.officeId= $("#officeId").attr("data-value");
            editUser.userCode= $("#userCode").val();
            editUser.userName= $("#userName").val();
            editUser.userBorn= $("#userBorn").val();
            editUser.sex= $("#sex").val();
            editUser.imgUrl= $("#userImage").val();
            editUser.cellPhone= $("#cellPhone").val();
            editUser.email= $("#email").val();
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
                    var url = "";
                    var flag = true;
                    if($.getUrlParam("id")== undefined || $.getUrlParam("id") =="" ){
                        url = ctxData + "/sys/user/save?date=" + new Date().getTime();
                    }else{
                        flag = false;
                        url = ctxData + "/sys/user/update?date=" + new Date().getTime();
                    }
                    $.ajax({
                        url : url,
                        data : editUser,
                        type : "post",
                        success : function(retData){
                            xqsight.win.alert(retData.msg,retData.status);
                            if(retData.status == "0"){
                                if(flag){
                                    xqsight.win.alert("您的默认密码是:!password");
                                }

                                var iframeContent = xqsight.tab.getCurrentIframeContent();
                                iframeContent.userMain.editCallBackFun({"userId" : $.getUrlParam("id")});
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
            var id = $.getUrlParam("id");
            if(id == undefined || id == "" ){
                return;
            }
            $.ajax({
                "url": ctxData + "/sys/user/querybyid?id=" + id + "&date=" + new Date().getTime,
                "success": function(retData){
                    if(retData.status == "0"){
                        var data = retData.data;
                        editUser.id = data.id;
                        editUser.orgId = data.orgId;

                        $("#companyId").ComboBoxTreeSetValue(data.companyId);
                        $("#officeId").ComboBoxTreeSetValue(data.officeId);
                        $("#userName").val(data.userName);
                        $("#userCode").val(data.userCode);
                        $("#userBorn").val(data.userBorn);
                        $("#userImage").val(data.imgUrl);
                        $("#imgUrl").attr("src",data.imgUrl)
                        $("#cellPhone").val(data.cellPhone);
                        $("#email").val(data.email);
                        $("#sex").selectpicker('val',data.sex);
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



