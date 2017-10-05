;(function(){
    'use strict'

    // 任务清单数据对象
    var taskData = [];

    init();

    // 点击submit按钮时间，增加任务
    $('#add-task-button').click(function(){
        var newTask = {};
        var $add_task_input = $('#add-task-input');
        var taskContent = $add_task_input.val();
        if (!taskContent) return;
        newTask.title = taskContent;
        taskData.push(newTask);
        store.set('taskData',taskData);
        refreshPage();
        $add_task_input.val('');
    });

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
    

    // 页面初始化
    function init()
    {
        taskData = store.get('taskData');
        refreshPage();
    }

    //刷新页面
    function refreshPage()
    {
        console.log('taskData',taskData);
        var templteResult = '';
        for (var i = taskData.length - 1; i >= 0; i--) {
            templteResult = templteResult + 
                buildTemplet(taskData[i].title,i);
        }
        $('.task-list').html(templteResult);
        deleteAction();
    }

    //生成模板
    function buildTemplet (title,index){
        if (!title) return;
        var templete = 
            '<div class="task-item" data-index=' + index +'>'+
            '<span><input type="checkbox" name="done"></span>'+
            '<span class="task-content">'+ title +'</span>'+
            '<span class="action-delete">delete</span>'+
            '<span class="action-detail">detail</span>'+
            '</div>'
        return templete;
    }

    //删除task中的数据
    function deleteData(index)
    {
        taskData.splice(index,1);
        store.set('taskData',taskData);
    }
})();