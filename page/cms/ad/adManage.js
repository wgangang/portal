/**
 * Created by user on 2015/12/14.
 */

xqsight.nameSpace.reg("xqsight.cms");

var layIndex;

(function () {
    xqsight.cms.adManage = function () {
        var ctxData = xqsight.utils.getServerPath("cms");

        /**
         * 申明内部对象
         * @type {xqsight.cms}
         */
        var obj = this;

        var editAd = {};

        var adEditor = {};

        /**
         * 初始化调用 function
         */
        this.init = function () {
            laydate({elem: '#adBeginTime', format: 'YYYY-MM-DD'});
            laydate({elem: '#adEndTime', format: 'YYYY-MM-DD'});
            //绑定事件
            $("#btn_save").bind("click", obj.validateFun);
            $("#btn_cancel").bind("click", obj.cancelFun);
            $("#addPic").on("click",function(){
                layIndex = layer.open({
                    type: 2,
                    title: '<i class="ace-icon fa fa-edit"></i>  图片裁剪',
                    shadeClose: false,
                    shade: 0.2,
                    shift: 1,
                    skin: "layui-layer-molv",
                    moveOut: true,
                    offset: "10px",
                    maxmin: true, //开启最大化最小化按钮
                    area: [$(window).width()-500 + 'px', $(window).height()-100 + 'px'],
                    content: "../cropper/cropper.html"
                });
            });
            $("#btn-preview").on("click",function(){
                xqsight.win.imgShow($("#adImage").val());
            });
            obj.editorFun();
            obj.formSetValue();
        };

        this.editorFun = function () {
            adEditor = new wangEditor('adText');
            // 上传图片
            adEditor.config.uploadImgUrl = ctxData + '/files/core/editor';
            adEditor.config.menus = [
                'source', '|', 'bold', 'underline', 'italic', 'strikethrough', 'eraser', 'forecolor', 'bgcolor',
                '|', 'quote', 'fontfamily', 'fontsize', 'head', 'unorderlist', 'orderlist', 'alignleft', 'aligncenter', 'alignright',
                '|', 'link', 'unlink', '|', 'undo', 'redo', 'fullscreen'
            ];
            adEditor.config.withCredentials = false;
            adEditor.config.hideLinkImg = true;
            adEditor.config.printLog = false;
            adEditor.create();
        }

        /**
         * 设置参数 function
         * @returns {string}
         */
        this.setParamFun = function () {
            editAd.adImage = $("#adImage").val();
            editAd.adName = $("#adName").val();
            editAd.type = $("#type").val();
            editAd.sort = $("#sort").val();
            editAd.adBeginTime = $("#adBeginTime").val();
            editAd.adEndTime = $("#adEndTime").val();
            editAd.adUrl = $("#adUrl").val();
            editAd.adText = encodeURIComponent(adEditor.$txt.html());
            editAd.remark = $("#remark").val();
        };

        /**  验证 function */
        this.validateFun = function () {
            $("#adForm").html5Validate(function () {
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
                    if ($.getUrlParam("adId") == undefined || $.getUrlParam("adId") == "") {
                        url = ctxData + "/cms/ad/save?date=" + new Date().getTime();
                    } else {
                        url = ctxData + "/cms/ad/update?date=" + new Date().getTime();
                    }
                    $.ajax({
                        url: url,
                        data: editAd,
                        method : "post",
                        success: function (retData) {
                            xqsight.win.alert(retData.msg, retData.status);
                            if (retData.status == "0") {
                                var iframeContent = xqsight.tab.getCurrentIframeContent();
                                iframeContent.adMain.editCallBackFun({"adId": $.getUrlParam("id")});
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
            var adId = $.getUrlParam("adId");
            if (adId == undefined || adId == "") {
                return;
            }
            $.ajax({
                url: ctxData + "/cms/ad/querybyid?date=" + new Date().getTime,
                data: {"adId": adId},
                success: function (retData) {
                    if (retData.status == "0") {
                        var data = retData.data;
                        editAd.adId = data.adId;
                        editAd.siteId = data.siteId;
                        $("#adImage").val(data.adImage);
                        $("#adName").val(data.adName);
                        $("#type").selectpicker('type', data.type);
                        $("#sort").val(data.sort);
                        $("#adBeginTime").val(data.adBeginTime);
                        $("#adEndTime").val(data.adEndTime);

                        $("#adUrl").val(data.adUrl);
                        $("#remark").val(data.remark);

                        adEditor.$txt.html(data.adText);
                    }
                }
            });
        };
    };

    /**
     * 初始化数据
     */
    $(document).ready(function () {
        adManage.init();
    });
})();

var adManage = new xqsight.cms.adManage();