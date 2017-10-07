;(function(){
    'use strict'

    // 任务清单数据对象
    var taskData = [];

    init();


    // 页面初始化
    function init()
    {
        taskData = store.get('taskData');
        refreshPage();
        listenAddTask();
        listenClickMask();
    }

    //刷新页面
    function refreshPage()
    {
        var templteResult = '';
        for (var i = taskData.length - 1; i >= 0; i--) {
            templteResult = templteResult + 
                buildTemplet(taskData[i].title,i);
        }
        $('.task-list').html(templteResult);
        deleteAction();
        listenDetailAction();
        listenDblClickTaskItem();
    }

    //生成模板
    function buildTemplet (title,index){
        if (!title) return;
        var templete = 
            '<div class="task-item" data-index=' + index +'>'+
            '<span><input type="checkbox" name="done"></span>'+
            '<span class="task-content">'+ title +'</span>'+
            '<span class="action-delete">删除</span>'+
            '<span class="action-detail">详细</span>'+
            '</div>'
        return templete;
    }

    //删除task中的数据
    function deleteData(index)
    {
        taskData.splice(index,1);
        store.set('taskData',taskData);
    }

    // 删除按钮点击操作
    function deleteAction(){
            $('.action-delete').click(function(){
            confirm('确认删除？');
            var $this = $(this);
            var index = $this.parent().attr('data-index');
            deleteData(index);
            refreshPage();
        });
    }

    // 详细按钮点击操作
    function listenDetailAction(){
        $('.action-detail').click(detailAction);
    }

    // 详细任务加载动作
    function detailAction(){
        var $this = $(this);
        var index = $this.parent().attr('data-index');
        var detailTpl = buildDetailTpl(index);
        $('.task-detail').html(detailTpl);
        showMask();
        showDetail();
        listenClickTitle(index);
        listenUpdateDetail(index);
    }

    // 显示面纱效果
    function showMask(){
        $('.task-detail-mask').show();
    }

    // 隐藏面纱效果
    function hideMask(){
        $('.task-detail-mask').hide();
    }

    // 显示详细任务
    function showDetail(){
        $('.task-detail').show();
    }

    // 隐藏详细任务
    function hideDetail(){
        $('.task-detail').hide();
    }

    //生成任务详情模板
    function buildDetailTpl(index){
        var dataItem = taskData[index];
        var tpl = '<form><div class="title">'+ dataItem.title +
                '</div>'+
                '<input class="titleInput" type="text" value="'+ dataItem.title +'">'+
                '<div class="description">'+
                '<textarea id="detailDescription">' + dataItem.description + '</textarea>'+
                '</div>'+
                '<div class="remind">'+
                '<input type="date" id="detailDateTime" value='+ dataItem.dueTime +'>'+
                '<button id="detailUpdateBtn" type="submit">submit</button>'+
                '</div></form>'
        return tpl;

    }

    // 添加任务事件
    function listenAddTask(){
            $('#add-task-button').on('click',function(){
            var newTask = {};
            var $add_task_input = $('#add-task-input');
            var taskContent = $add_task_input.val();
            if (!taskContent) return;
            newTask.title = taskContent;
            taskData.push(newTask);
            store.set('taskData',taskData);
            refreshPage();
            $add_task_input.val(null);
        });
    }
    

    // 点击面纱恢复事件
    function listenClickMask(){
            $('.task-detail-mask').on('click',function(){
            hideMask();
            hideDetail();
        })
    }

    //双击task弹出详细任务页面
    function listenDblClickTaskItem(){
        $('.task-item').on('dblclick',function(){
            var $this = $(this);
            var index = $this.attr('data-index');
            var detailTpl = buildDetailTpl(index);
            $('.task-detail').html(detailTpl);
            showMask();
            showDetail();
            listenClickTitle(index);
            listenUpdateDetail(index);
        })
    }

    // 点击详细标题变成编辑事件
    function listenClickTitle(index)
    {
        $('.title').on('click',function(){
            var data = taskData[index];
            var $this = $(this);
            $this.hide();
            $('input.titleInput').show();
        })
    }

    // 点击更新事件，更新详细信息
    function listenUpdateDetail(index){
        $('#detailUpdateBtn').on('click',function(e){
            e.preventDefault();
            var data = {}
            data.title       = $('.titleInput').val();
            data.description = $('#detailDescription').val();
            data.dueTime    = $('#detailDateTime').val();
            updateData(index,data);
            hideDetail();
            hideMask();
        })
    }

    // 更新详细任务数据
    function updateData(index,data){
        console.log('taskData[index]',taskData[index]);
        taskData[index] = $.extend({},taskData[index],data);
        store.set('taskData',taskData);
    }

})();