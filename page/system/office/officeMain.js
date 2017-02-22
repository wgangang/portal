/**
 * Created by user on 2015/12/14.
 */

saicfc.nameSpace.reg("sys.office");

(function(){
    sys.office.officeMain = function(){
        var ctxData = saicfc.utils.getServerPath("system");

        /**
         * 申明内部对象
         * @type {saicfc.pmpf}
         */
        var obj = this;

        this.officeTable = {};
        this.officeTree = {};
        this.curSelTree={};

        /**
         * 初始化调用 function
         */
        this.init = function() {
            /**
             * 查询
             */
            $(".btn-search").click(function(){
                obj.officeTable.ajax.reload();
            });
            $(document).bind("keydown",".filter input",function(e){
                var theEvent = window.event || e;
                var code = theEvent.keyCode || theEvent.which;
                if (code == 13) {
                    obj.officeTable.ajax.reload();
                }
            });

            /**
             * 重置
             */
            $("#btn-undo").click(function(){
                saicfc.utils.cleanValue(".filter");
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

            obj.loadOfficeTreeFun();
            obj.loadOfficeTableFun();
        };


        /**
         * 新增 function
         */
        this.plusFun = function(){
            if(obj.curSelTree.id == undefined ){
                saicfc.win.alert("请选择要添加的节点");
                return;
            }
            saicfc.win.show("机构新增","system/office/officeManage.html?parentId=" + obj.curSelTree.id,$(window).width()-150,500);
        }

        /**
         * 修改 function
         */
        this.editFun = function(){
            var selRows = obj.officeTable.rows(".info").data();
            if(selRows.length < 1){
                saicfc.win.alert("请选择修改的数据");
                return;
            }
            saicfc.win.show("机构修改","system/office/officeManage.html?officeId=" + selRows[0].officeId,$(window).width()-150,500);
        }

        /**
         * 删除 function
         */
        this.removeFun = function(){
            var selRows = obj.officeTable.rows(".info").data();
            if(selRows.length < 1){
                saicfc.win.alert("请选择修改的数据");
                return;
            }
            saicfc.win.confirm("确认删除吗？",function(btn){
                if(btn == "yes"){
                    $.ajax({
                        url: ctxData + "/sys/office/delete?date=" + new Date().getTime(),
                        data: {officeId : selRows[0].officeId },
                        success: function(retData){
                            saicfc.win.alert(retData.msg,retData.status);
                            if(retData.status == "0"){
                                obj.loadOfficeTreeFun();
                            }
                        }
                    });
                }
            });
        }

        /**
         * 加载数据表 function
         */
        this.loadOfficeTableFun = function(){
            var record_table = $("#office-table").DataTable({
                "bAutoWidth" : false,
                "bFilter" : false,// 搜索栏
                "bSort" : false,
                "bInfo" : false,// Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
                "bServerSide" : true,
                "paging":   false,
                "sAjaxSource": ctxData + '/sys/office/query',
                "fnServerData": function (sUrl, aoData, fnCallback) {
                    $.ajax({
                        url: sUrl,
                        data: aoData,
                        success: function(data){
                            fnCallback(data);
                            //渲染结束重新设置高度
                            parent.saicfc.common.setIframeHeight($.getUrlParam(saicfc.iframeId));
                        }
                    });
                },
                "fnServerParams": function (aoData) {
                    var parentId = 1;
                    if(obj.curSelTree.id != undefined ){
                        parentId = obj.curSelTree.id;
                    }
                    aoData.push(
                        { "name": "officeName", "value": $("#officeName").val() },
                        { "name": "officeCode", "value": $("#officeCode").val() },
                        { "name": "parentId", "value": parentId }
                    );
                },
                "aoColumnDefs": [
                    {
                        sDefaultContent: '',
                        aTargets: [ '_all' ]
                    }
                ],
                "aoColumns": [{
                    data : "officeId",
                    sWidth : "2",
                    render : function(value){
                        return '<label class="pos-rel"><input id="' + value + '" type="checkbox" class="ace" /><span class="lbl"></span></label>';
                    }
                },{
                    data: "officeName",
                    sWidth : "100",
                    sClass : "text-center"
                },{
                    data: "officeCode",
                    sWidth : "100",
                    sClass : "text-center"
                },{
                    data: "officeType",
                    sWidth : "100",
                    sClass : "text-center",
                    render : function(value){
                        if(value == "1"){
                            return "公司";
                        }else if(value == "2"){
                            return "部门";
                        }else if(value == "3"){
                            return "小组";
                        }else {
                            return "其他";
                        }

                    }
                },{
                    data: "master",
                    sWidth : "100",
                    sClass : "text-center"
                },{
                    data: "phone",
                    sWidth : "100",
                    sClass : "text-center"
                },{
                    data: "sort",
                    sWidth : "40",
                    sClass : "text-center"
                },{
                    data: "createTime",
                    sWidth : "80",
                    sClass : "text-center",
                    render : function(value){
                        return saicfc.moment.formatYMD(value);
                    }
                },{
                    data: "officeId",
                    sWidth : "80",
                    sClass : "text-center",
                    render : function(){
                        return "<div class='bolder'> <a class='red' href='javaScript:officeMain.editFun()'><i class='ace-icon fa fa-edit'></i></a> | " +
                            "<a class='red' href='javaScript:officeMain.removeFun()'><i class='ace-icon fa fa-remove'></i></a></div> ";
                    }
                }]
            });

            obj.officeTable = record_table;

            //单选事件
            $("#office-table tbody").on("click","tr",function() {
                $.each($("#office-table tbody").find("input[type='checkbox']"),function(index,object){
                    object.checked = false;
                });
                $(this).find("input[type='checkbox']").get(0).checked = true;
                $("#office-table>tbody>tr").removeClass("info");
                $(this).addClass("info");
            });

            $("#office-table tbody").on("dblclick","tr",function() {
                obj.editFun();
            });
        }

        /*** 加载 tree **/
        this.loadOfficeTreeFun = function () {
            $.ajax({
                url: ctxData + "/sys/office/querytree?date="+new Date().getTime(),
                success: function(retData){
                    if(retData.status == 0){
                        $.fn.zTree.init($("#officeTree"),{
                            check: {
                                enable: false,
                            },
                            data: {
                                simpleData: {
                                    enable: true
                                }
                            },
                            callback: {
                                onClick: function onClick(e, treeId, treeNode) {
                                    obj.officeTree.selectNode(treeNode);
                                    obj.curSelTree = treeNode;
                                    obj.officeTable.ajax.reload();
                                    return false;
                                }
                            }
                        }, retData.data);

                        obj.officeTree = $.fn.zTree.getZTreeObj("officeTree");

                        if(obj.curSelTree.id != undefined ){
                            obj.officeTree.selectNode(obj.curSelTree);
                        }else{
                            var nodes = obj.officeTree.getNodes();
                            if (nodes.length>0) {
                                obj.officeTree.selectNode(nodes[0]);
                                obj.curSelTree = nodes[0];
                            }
                        }

                        obj.officeTree.expandAll(true);

                        obj.officeTable.ajax.reload();
                    }
                    //渲染结束重新设置高度
                    parent.saicfc.common.setIframeHeight($.getUrlParam(saicfc.iframeId));
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
            obj.loadOfficeTreeFun();
            if(params.officeId== undefined || params.officeId =="" ){
                return;
            }
            //选中之前选中的数据

        }


    };

    /**
     * 初始化数据
     */
    $(document).ready(function() {
        officeMain.init();
    });
})();
var officeMain = new sys.office.officeMain();





