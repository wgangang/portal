/**
 * Created by user on 2015/12/14.
 */

xqsight.nameSpace.reg("cms.article");
var layIndex;

(function () {
    cms.article.articleManage = function () {
        var ctxData = xqsight.utils.getServerPath("cms");

        /**
         * 申明内部对象
         * @type {xqsight.pmpf}
         */
        var obj = this;

        var editArticle = {};

        var artileEditor = {};


        /**  初始化调用 function **/
        this.init = function () {
            laydate({elem: '#publishTime', format: 'YYYY-MM-DD'});

            //绑定事件
            $("#btn_save").bind("click", obj.validateFun);
            $("#btn_cancel").bind("click", obj.cancelFun);
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
            obj.editorFun();
            obj.tags();
        };

        this.tags = function () {
            var tag_input = $('#tags');
            try {
                tag_input.tag({
                    placeholder: tag_input.attr('placeholder'),
                    allowDuplicates: false,
                    //enable typeahead by specifying the source array
                    source: ace.vars['US_STATES'],//defined in ace.js >> ace.enable_search_ahead
                    //or fetch data from database, fetch those that match "query"
                    source : function (query, process) {
                        $.ajax({url: ctxData + '/cms/tag/queryall?tagName=' + encodeURIComponent(query)})
                            .done(function (result_items) {
                                array = new Array();
                                $.each(result_items.data,function(index,object){
                                    array.push(object.tagName);
                                })
                                process(array);
                            });
                    }
                });
                obj.formSetValue();
            }
            catch (e) {
            }
        };

        this.editorFun = function () {
            artileEditor = new wangEditor('articleContent');
            // 上传图片
            artileEditor.config.uploadImgUrl = ctxData + '/files/core/editor';
            artileEditor.config.withCredentials = false;
            artileEditor.config.hideLinkImg = true;
            artileEditor.config.printLog = false;
            artileEditor.config.menus = [
                'bold', 'underline', 'italic',  'strikethrough', 'eraser', 'forecolor', 'bgcolor',
                '|',  'quote', 'fontfamily', 'fontsize', 'head', 'unorderlist', 'orderlist', 'alignleft', 'aligncenter', 'alignright',
                '|',  'link', 'unlink',  'table', 'emotion',
                '|', 'img',  'video', 'insertcode',  '|', 'undo', 'redo', 'fullscreen'

            ];
            artileEditor.config.uploadParams = {
                "editor": 'wangeditor'
            };
            artileEditor.config.uploadImgFns.onload = function (resultText, xhr) {
                artileEditor.command(null, 'InsertImage', resultText);
            };

            artileEditor.create();
        }

        /**
         * 设置参数 function
         * @returns {string}
         */
        this.setParamFun = function () {
            editArticle.articleTitle = $("#articleTitle").val();
            editArticle.articleDesp = $("#articleDesp").val();
            editArticle.articleAuthor = $("#articleAuthor").val();
            editArticle.articleSource = $("#articleSource").val();
            editArticle.articleHit = $("#articleHit").val();
            editArticle.publishTime = $("#publishTime").val();
            editArticle.articleImg = $("#articleImg").val();
            editArticle.department = $("#department").val();
            editArticle.articleContent = encodeURIComponent(artileEditor.$txt.html());
            editArticle.tags = $("#tags").val();
        };

        /**  验证 function */
        this.validateFun = function () {
            $("#articleForm").html5Validate(function () {
                obj.saveFun();
            }, {
                validate: function () {
                    return true;
                }
            });
        };

        /**  保存 function */
        this.saveFun = function () {
            var callback = function (btn) {
                if (btn == "yes") {
                    obj.setParamFun();
                    var url = "";
                    if ($.getUrlParam("articleId") == undefined || $.getUrlParam("articleId") == "") {
                        url = ctxData + "/cms/article/save?date=" + new Date().getTime();
                    } else {
                        url = ctxData + "/cms/article/update?date=" + new Date().getTime();
                    }

                    $.ajax({
                        "url": url,
                        "data": editArticle,
                        "type": "POST",
                        "success": function (retData) {
                            xqsight.win.alert(retData.msg);
                            if (retData.status == "0") {
                                var iframeContent = xqsight.tab.getCurrentIframeContent();
                                iframeContent.articleMain.editCallBackFun({"articleId": $.getUrlParam("articleId")});
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
            // xqsight.tab.getCurrentIframeContent($.getUrlParam(xqsight.iframeId)).articleMain.artilceTable.ajax.reload()
            //window.top.index.closeCurrentTab(window.top.$("#tab_article"));
            xqsight.win.close();
        };

        /**
         * form 表单初始化数据
         */
        this.formSetValue = function () {
            var articleId = $.getUrlParam("articleId");
            if (articleId == undefined || articleId == "") {
                return;
            }
            $.ajax({
                url: ctxData + "/cms/article/querybyid?articleId=" + articleId + "&date=" + new Date().getTime(),
                success: function (retData) {
                    if (retData.status == "0") {
                        var data = retData.data;
                        editArticle.articleId = data.articleId;
                        $("#articleTitle").val(data.articleTitle);
                        $("#articleDesp").val(data.articleDesp);
                        $("#articleAuthor").val(data.articleAuthor);
                        $("#articleSource").val(data.articleSource);
                        $("#publishTime").val(data.publishTime);
                        $("#articleImg").val(data.articleImg);
                        $("#department").val(data.department);
                        $("#imgUrl").attr("src",data.articleImg);
                        $("#articleHit").selectpicker('articleHit', data.articleHit);
                        $.each(data.tags,function(index,object){
                            var $tag_obj = $('#tags').data('tag');
                            $tag_obj.add(object);
                        });
                        $("#tags").val(data.tags);
                        artileEditor.$txt.html(data.articleContent);
                    }
                }
            });
        };
    };

    /**
     * 初始化数据
     */
    $(document).ready(function () {
        articleManage.init();
    });
})();

var articleManage = new cms.article.articleManage();

var _imgCallBack = function(data){
    $("#articleImg").val(data);
    $("#imgUrl").attr("src",data);
    layer.close(layIndex)
}