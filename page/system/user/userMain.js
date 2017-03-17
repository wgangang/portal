
/**
 * Created by user on 2015/12/14.
 */

xqsight.nameSpace.reg("sys.user");

(function(){
    sys.user.userMain = function(){
        var ctxData = xqsight.utils.getServerPath("system");

        /**
         * 申明内部对象
         * @type {xqsight.pmpf}
         */
        var obj = this;

        /**
         * 列表对象
         *
         * @type {{}}
         */
        this.userTable = {};

        /**
         * 初始化调用 function
         */
        this.init = function() {
            /**
             * 查询
             */
            $(".btn-search").click(function(){
                obj.userTable.ajax.reload();
            });
            /**
             * 重置
             */
            $("#btn-undo").click(function(){
                xqsight.utils.cleanValue(".filter");
            });
            /**
             * 新增
             */
            $("#btn-plus").on("click",obj.plusFun);
            /**
             * 修改
             */
            $("#btn-edit").on("click",obj.editFun);
            /**
             * 删除
             */
            $("#btn-remove").on("click",obj.removeFun);

            /**
             * 加载列表
             */
            obj.loadUserTableFun();
        };

        /**
         * 新增 function
         */
        this.plusFun = function(){
            xqsight.win.show("登录用户新增","system/user/userManage.html?",$(window).width(),500);
        }

        /**
         修改 function
         */
        this.editFun = function(){
            var selRows = obj.userTable.rows(".info").data();
            if(selRows.length < 1){
                xqsight.win.alert("请选择修改的数据");
                return;
            }
            xqsight.win.show("修改","system/user/userManage.html?id=" + selRows[0].id,$(window).width()-150,$(window).height());
        }


        /**
         * 删除 function
         */
        this.removeFun = function(){
            var selRows = obj.userTable.rows(".info").data();
            if(selRows.length < 1){
                xqsight.win.alert("请选择删除的数据");
                return;
            }
            xqsight.win.confirm("确认删除吗？",function(btn){
                if(btn == "yes"){
                    $.ajax({
                        url : ctxData + "/sys/user/delete?date=" + new Date().getTime(),
                        data : "id=" + selRows[0].id,
                        success : function(retData){
                            xqsight.win.alert(retData.msg,retData.status);
                            if(retData.status == "0"){
                                obj.userTable.ajax.reload();
                            }
                        }
                    });
                }
            });
        }

        /**
         * 加载数据表 function
         */
        this.loadUserTableFun = function(){
            var record_table = $("#user-table").DataTable({
                "oLanguage" : { // 汉化
                    sUrl : xqsight.utils.getServerPath("dataTableLocal")
                },
                "bAutoWidth" : false,
                "bFilter" : false,// 搜索栏
                "bLengthChange" : false,// 每行显示记录数
                "iDisplayLength" : 15,// 每页显示行数
                "bSort" : false,
                "bInfo" : true,// Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
                "sPaginationType" : "full_numbers", // 分页，一共两种样式 另一种为two_button // 是datatables默认
                "bServerSide" : true,
                "sAjaxSource": ctxData + '/sys/user/query',
                "fnServerData": function (sUrl, aoData, fnCallback) {
                    $.ajax({
                        "url": sUrl,
                        "data": aoData,
                        "success": function(data){
                            fnCallback(data);
                            //渲染结束重新设置高度
                            parent.xqsight.common.setIframeHeight($.getUrlParam(xqsight.iframeId));
                        }
                    });
                },
                "fnServerParams": function (aoData) {
                    aoData.push(
                        { "name": "loginId", "value": $("#loginId").val() }
                    );
                },
                "aoColumnDefs": [
                    {
                        sDefaultContent: '',
                        aTargets: [ '_all' ]
                    }
                ],
                "aoColumns": [{
                    data : "id",
                    sWidth : "2",
                    render : function(value){
                        return '<label class="pos-rel"><input id="' + value + '" type="checkbox" class="ace" /><span class="lbl"></span></label>';
                    }
                },{
                    data: "userName",
                    sWidth : "120",
                    sClass : "text-center",
                    sSort : false
                },{
                    data: "companyName",
                    sWidth : "120",
                    sClass : "text-center",
                    sSort : false
                },{
                    data: "departmentName",
                    sWidth : "80",
                    sClass : "text-center",
                    sSort : false
                },{
                    data : "userCode",
                    sWidth : "60",
                    sClass : "text-center"
                },{
                    data : "sex",
                    sWidth : "80",
                    sClass : "text-center",
                    render : function(value){
                        if(value == "1"){return "男"}
                        else if(value == "1"){return "女"}
                        else{return "未知"}
                    }
                },{
                    data : "cellphone",
                    sWidth : "80",
                    sClass : "text-center"
                },{
                    data : "email",
                    sWidth : "80",
                    sClass : "text-center"
                },{
                    data : "id",
                    sWidth : "80",
                    sClass : "text-center",
                    render : function(value){
                        return "<div class='bolder'>"
                            + "<a class='red' href='javaScript:userMain.resetPwdFun(\"" + value + "\")'>重置密码</a> "
                            + "</div> ";
                    }
                },{
                    data : "id",
                    sWidth : "60",
                    sClass : "text-center",
                    render : function(){
                        return "<div class='bolder'>"
                            + "<a class='red' href='javaScript:userMain.editFun()'><i class='ace-icon fa fa-edit'></i></a> | "
                            + "<a class='red' href='javaScript:userMain.removeFun()'><i class='ace-icon fa fa-remove'></i></a> "
                            + "</div> ";
                    }
                }]
            });

            obj.userTable = record_table;

            //单选事件
            $("#user-table tbody").on("click","tr",function() {
                $.each($("#user-table tbody").find("input[type='checkbox']"),function(index,object){
                    object.checked = false;
                });
                $(this).find("input[type='checkbox']").get(0).checked = true;
                $("#user-table>tbody>tr").removeClass("info");
                $(this).addClass("info");
            });

            $("#user-table tbody").on("dblclick","tr",function() {
                obj.editFun();
            });
        }

        /**
         * 重置密码
         * @param id
         */
        this.resetPwdFun = function(id){
            xqsight.win.confirm("确认重置密码吗？",function(btn){
                if(btn == "yes"){
                    $.ajax({
                        "url": ctxData + "/sys/login/resetpwd?date=" + new Date().getTime(),
                        "data": "id=" + id,
                        "dataType": "jsonp",
                        "cache": false,
                        "success": function(retData){
                            xqsight.win.alert(retData.msg,retData.status);
                        }
                    });
                }
            });
        }

        /**
         *
         * 新增编辑回调函数
         *
         */
        this.editCallBackFun = function(params){
            //加载数据
            obj.userTable.ajax.reload();
            if(params.userId== undefined || params.userId =="" ){
                return;
            }
            //选中之前选中的数据

        }
    };

    /**
     * 初始化数据
     */
    $(document).ready(function() {
        userMain.init();
    });
})();
var userMain = new sys.user.userMain();





