var beginDay = "2022-1-26"

// 暂时还没找到浏览器运行 nodejs 的方法
// const fs = require('fs');
// const path = require('path');
const fs = null;

// 判断选择类型
var classChoose = parseInt($('select[name="eventClass"]').val());
if (classChoose == 0) {
    $("#changeMoneyInfoArea").show();
    $("#changeEventInfoArea").hide();
} else {
    $("#changeMoneyInfoArea").hide();
    $("#changeEventInfoArea").show();
}


function justifySize() {
    document.querySelector('.work_table').style.height = window.innerHeight - 120 + 'px';
}


window.addEventListener('resize', function () {
    justifySize();
})

// 日历 flex 模式
document.querySelector("#calendar").style.display = "flex";

// 将字符串转换为对象
function changeFormContentToObject(str) {
    while (str.indexOf("=") >= 0) {
        str = str.replace("=", '":"');
    }
    while (str.indexOf("&") >= 0) {
        str = str.replace("&", '","');
    }
    str = '{"' + str + '"}';
    return JSON.parse(str);
}

var moneyData = [];
var eventData = [];

function getLocalData() {
    // nodejs环境检测
    if (fs) {
        fs.readFile(path.join(__dirname, '../../', './data/moneyData.txt'), function (err, data) {
            if (err) return alert('读取本地数据失败 ' + err.message);
            if (moneyData == '') moneyData = [];
            else moneyData = JSON.parse(data);
        })
        fs.readFile(path.join(__dirname, '../../', './data/eventData.txt'), function (err, data) {
            if (err) return alert('读取本地数据失败 ' + err.message);
            if (eventData == '') eventData = [];
            else eventData = JSON.parse(data);
        })
    }
    else {
        // 本地存储
        // moneyData = JSON.parse(localStorage.getItem("money"));
        // eventData = JSON.parse(localStorage.getItem("event"));

        // node 请求
        $.get('http://127.0.0.1/content', function (res) {
            if (res.status !== 200) {
                alert('获取数据失败! 错误码:' + res.status);
            }
            moneyData = res.moneyData;
            eventData = res.eventData;
        })

        // 保险代码
        if (moneyData == null) moneyData = [];
        if (eventData == null) eventData = [];
    }
    showLocalData();
}

// 显示列表
function showLocalData() {
    // 记账列表
    var htmlMoneyStruct = [];
    for (var i = 0; i < moneyData.length; i++) {
        htmlMoneyStruct.push('<li class="box_shadow"><span class= "list_date">' + moneyData[i].year + '-' + moneyData[i].month + '-' + moneyData[i].day + '</span><p><span>收入 : <span class="red">' + moneyData[i].moneyGet + '</span></span> <span>支出 : <span class="green">' + moneyData[i].moneySpend + '</span></span></p><i class="glyphicon glyphicon-trash"></i><text style="display: none;">' + moneyData[i].moneyInfo + '</text></li>');
    }
    $('#moneyShowArea').find('li').remove();
    $('#moneyShowArea').append(htmlMoneyStruct);
    // 显示支出收入
    var atNow = 0;
    for (var i = 0; i < moneyData.length; i++) {
        atNow += parseFloat(moneyData[i].moneyGet) - parseFloat(moneyData[i].moneySpend);
    }
    $('#bookKeeping span').first().html(atNow.toFixed(2));
    $('#moneyShow').first().html(atNow.toFixed(2));

    var yesterdayNum = $('.item-curDay').prev().attr('data');
    var yesterday = null;
    if (yesterdayNum) {
        yesterday = searchData(0, parseInt(yesterdayNum.substr(0, 4)), parseInt(yesterdayNum.substr(4, 2)), parseInt(yesterdayNum.substr(6, 2)));
    }
    var yesterdaySpend = 0;
    if (yesterday) {
        for (var i = 0; i < yesterday.length; i++) {
            yesterdaySpend += parseFloat(yesterday[i].moneyGet) - parseFloat(yesterday[i].moneySpend);
        }
    }
    $('#bookKeeping span').last().html(yesterdaySpend.toFixed(2));


    // 事件列表
    var htmlEventStruct = [];
    var eventFinishCount = 0;
    // 显示待办事件数量
    for (var i = 0; i < eventData.length; i++) {
        if (eventData[i].eventFinish) eventFinishCount++;
        // <input type="checkbox">
        htmlEventStruct.push('<li class="box_shadow"><span class= "list_date">' + eventData[i].year + '-' + eventData[i].month + '-' + eventData[i].day + '</span><p>' + eventData[i].eventTitle + '</p><i class="glyphicon glyphicon-trash"></i><text style="display: none;">' + eventData[i].eventInfo + '</text></li>')
    }
    $('#eventShowArea').find('li').remove();
    $('#eventShowArea').append(htmlEventStruct);

    $('#toDoList span').first().html(eventFinishCount);
    $('#toDoList span').last().html(eventData.length - eventFinishCount);
    $('#unfinishedCount').last().html(eventData.length - eventFinishCount);

}

// 数据保存
function saveLocalData(data, classChoose) {
    // 记录单有内容
    if (data) {
        var temp = {};
        data.year ? temp.year = data.year : temp.year = new Date().getFullYear();
        data.month ? temp.month = data.month : temp.month = new Date().getMonth() + 1;
        data.day ? temp.day = data.day : temp.day = new Date().getDate();
        // 判断数据类型
        if (classChoose) {
            data.eventTitle ? temp.eventTitle = data.eventTitle : temp.eventTitle = "无";
            data.eventInfo ? temp.eventInfo = data.eventInfo : temp.eventInfo = "无";
            // data.eventFinish ? temp.eventFinish = data.eventFinish : data.eventFinish = 0;
            eventData.push(temp);
        } else {
            data.moneySpend ? temp.moneySpend = data.moneySpend : temp.moneySpend = 0;
            data.moneyGet ? temp.moneyGet = data.moneyGet : temp.moneyGet = 0;
            data.moneyInfo ? temp.moneyInfo = data.moneyInfo : temp.moneyInfo = "无";
            moneyData.push(temp);
        }
        $('input').val("");
        $('textarea').val("");
    }

    // 本地存储
    // localStorage.setItem("event", JSON.stringify(eventData));
    // localStorage.setItem("money", JSON.stringify(moneyData));

    // node 后端对接
    console.log(moneyData);
    $.post('http://127.0.0.1/api/moneyBooking', moneyData, function (res) {
        console.log(res);
        if (res.status !== 201) {
            alert('提交失败! 错误码:' + res.status);
        }
    })
    $.post('http://127.0.0.1/api/eventBooking', eventData, function (res) {
        console.log(res);
        if (res.status !== 201) {
            alert('提交失败! 错误码:' + res.status);
        }
    })

    // 提交后显示
    getLocalData();
    // 为列表点击添加事件
    addShowDetails();
}

function changeTableList(select1, select2 = 1) {
    if (select2 > 0) {
        $('*[data-table-index]').filter(select1).show().siblings('*[data-table-index]').hide();
    } else {
        $('*[data-table-index]').hide();
        $('*[data-table-index]').filter(select1).show().find(select2).show().siblings('*[data-table-index]').hide();
    }
    return;
}

// 通过日期查询 返回查询到的所有对象 , 否则返回 null
function searchData(classChoose, tyear, tmonth, tday) {
    var res = [];
    switch (classChoose) {
        // moneyData查询
        case 0:
            for (var i = 0; i < moneyData.length; i++) {
                if (parseInt(moneyData[i].day) == tday && parseInt(moneyData[i].month) == tmonth && parseInt(moneyData[i].year) == tyear) res.push(moneyData[i])
            }
            break;
        // eventData查询
        case 1:
            for (var i = 0; i < eventData.length; i++) {
                if (parseInt(eventData[i].day) == tday && parseInt(eventData[i].month) == tmonth && parseInt(eventData[i].year) == tyear) res.push(eventData[i])
            }
            break;
        default:
            return res;
    }
    return res;
}

function addShowDetails() {
    let displaySelect = 0;
    // 移除原有事件
    $('#moneyShowArea').find('li').off('click');
    $('#eventShowArea').find('li').off('click');

    // 添加事件
    $('#moneyShowArea').find('li').on('click', function () {
        changeTableList("#details", "#moneyDetails");

        const date = $(this).find('.list_date').html().split("-");
        $('#detailsDate').html(date[0] + " 年 " + date[1] + " 月 " + date[2] + " 日");

        const spend = $(this).find('.green').html();
        const get = $(this).find('.red').html();
        const info = $(this).find('text').html();

        $('#moneyDetails div:first-child').find('span').html(spend);
        $('#moneyDetails div:last-child').find('span').html(get);
        $('#detailsInfo').html(info);

        displaySelect = 0;
    })

    $('#eventShowArea').find('li').on('click', function () {
        changeTableList("#details", "#toDoDetails");

        const date = $(this).find('.list_date').html().split("-");
        $('#detailsDate').html(date[0] + " 年 " + date[1] + " 月 " + date[2] + " 日")

        const title = $(this).find('p').html();
        const info = $(this).find('text').html();

        $('#toDoDetails').find('span').html(title);
        $('#detailsInfo').html(info);

        displaySelect = 1;
    })

    // 返回按钮
    $('.back_to_list').on('click', function () {
        switch (displaySelect) {
            case 0:
                changeTableList("#bigList", "#moneyShowArea");
                break;
            case 1:
                changeTableList("#bigList", "#eventShowArea");
                break;
            default:
                changeTableList("#bigList", "#moneyShowArea");
                break;
        }
    })

    // 删除按钮
    $('.small_list li').find('i').on('click', function (e) {
        e.stopPropagation();
        let item = this;
        $('#delete_confirm').modal('toggle');
        $('#delete_confirm .btn-primary').on('click', function () {
            // 判断是哪个模块的
            if ($(item).parent().parent().attr('id') === "moneyShowArea") {
                moneyData.splice($(item).parent().index() - 1, 1);
            }
            else if ($(item).parent().parent().attr('id') === "eventShowArea") {
                eventData.splice($(item).parent().index() - 1, 1);
            }
            saveLocalData(null, null);
            $('#delete_confirm').modal('toggle');
            // 防止反复弹出
            $(this).off('click');
        })
    })
}

window.addEventListener("load", function () {
    getLocalData();
    justifySize();

    $(function () {

        // 分时段问候
        $.get('https://api.xlongwei.com/service/datetime/workday.json', function (res) {
            if (res.day) {
                res.day = res.day.split("-");
                $('#welcome_page h3').text('今天是 ' + res.day[0] + '年 ' + res.day[1] + '月 ' + res.day[2] + '日');
            } else {
                // 本地时间
                var year = new Date().getFullYear();
                var month = new Date().getMonth() + 1;
                var date = new Date().getDate();
                $('#welcome_page h3').text('今天是 ' + year + ' 年 ' + month + ' 月 ' + date + ' 日');
            }

        })

        var rightNow = new Date();
        var askText = 'Hi ~ ';
        var hour = rightNow.getHours();
        if (hour >= 18 || hour <= 3) askText += "晚上好！"
        else if (hour >= 4 && hour <= 10) askText += "早上好！"
        else if (hour >= 11 && hour <= 1) askText += "中午好！";
        else askText += "下午好！";

        $('#welcome_page h2').text(askText);

        // 一言
        $.ajax({
            type: 'GET',
            // url: 'https://v1.hitokoto.cn?c=a',
            success: function (data) {
                if (data.hitokoto === undefined) {
                    $('#hitokoto_text').text('今天一言君心情不好，已经提桶跑路了');
                }
                else {
                    var res = data.hitokoto + ' --- ' + data.from;
                    $('#hitokoto_text').text(res);
                }
            }
        })
    })

    // 限制所有type number 的输入框只能输入数字
    $('input[data-inputClass="number"]').attr('onkeyup', "clearNoNum(this)")

    // 模态框选择类别显示对应模块
    $('select[name="eventClass"]').on('click', 'option', function () {
        if ($(this).val() == 0) {
            $("#changeMoneyInfoArea").show();
            $("#changeEventInfoArea").hide();
        } else {
            $("#changeMoneyInfoArea").hide();
            $("#changeEventInfoArea").show();
        }
    })

    // 为列表按钮点击添加事件
    addShowDetails();

    // 提交点击
    $('#saveData').on('click', function () {
        var data = $('#eventInfoArea').serialize();
        data.eventFinish = 0;
        classChoose = parseInt($('select[name="eventClass"]').val());

        data = changeFormContentToObject(data);

        // 数据提交
        saveLocalData(data, classChoose);
    })

    // 点击模块跳转到对应列表
    $(function () {
        // 工作台主页
        $('#main_table>h4').on('click', function () {
            changeTableList("#welcome_page");
            $(this).show();
        })
        // 记账
        $('#bookKeeping').on('click', function () {
            changeTableList("#bigList", "#moneyShowArea");
        })
        // 事务
        $('#toDoList').on('click', function () {
            changeTableList("#bigList", "#eventShowArea");
        })
    })
})
