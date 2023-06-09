import emitter from "./mittBus";

function Drag(outId, inId) {
    this.oDiv = document.getElementById(outId);
    this.iDiv = document.getElementById(inId);
    this.oDiv.oncontextmenu = () => false;
    var _this = this;
    this.iDiv.onmousedown = function (ev) {
        _this.funcDown(ev);
    };
    document.onmouseup = this.funcUp;
}

Drag.prototype.funcDown = function (ev) {
    var e = ev || window.event;
    this.offsetX = e.clientX - this.oDiv.offsetLeft;
    this.offsetY = e.clientY - this.oDiv.offsetTop;

    var _this = this;
    document.onmousemove = function (ev) {
        _this.funcMove(ev);
    };
}

Drag.prototype.funcMove = function (ev) {
    var e = ev || window.event;
    var l = e.clientX - this.offsetX;
    var t = e.clientY - this.offsetY;
    var windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (e.clientX > 0 && e.clientX < windowWidth) {
        this.oDiv.style.left = l + 'px';
    }
    if (e.clientY > 0 && e.clientY < windowHeight) {
        this.oDiv.style.top = t + 'px';
    }
}

Drag.prototype.funcUp = function (ev) {
    document.onmousemove = null;
}

function DragTo(id, list) {
    this.initialArr = {
        initiall: null,
        initialt: null
    }
    this.oDiv = document.getElementById(id);
    this.list = list;
    this.oDiv.oncontextmenu = () => false;
    var _this = this;
    this.oDiv.onmousedown = function (ev) {
        _this.funcDown(ev);
    };
    this.oDiv.onmouseup = function (ev) {
        _this.funcUp(ev);
    };
}

DragTo.prototype.funcDown = function (ev) {
    var e = ev || window.event;
    this.offsetX = e.clientX - this.oDiv.offsetLeft;
    this.offsetY = e.clientY - this.oDiv.offsetTop;
    var l = e.clientX - this.offsetX;
    var t = e.clientY - this.offsetY;
    this.initialArr = {
        initiall: l,
        initialt: t
    }
    var _this = this;
    document.onmousemove = function (ev) {
        _this.funcMove(ev);
    };
}

DragTo.prototype.funcMove = function (ev) {
    var e = ev || window.event;
    var l = e.clientX - this.offsetX;
    var t = e.clientY - this.offsetY;

    this.oDiv.style.left = l + 'px';
    this.oDiv.style.top = t + 'px';
}

DragTo.prototype.funcUp = function (ev) {
    document.onmousemove = null;
    this.oDiv.style.left = this.initialArr.initiall + 'px';
    this.oDiv.style.top = this.initialArr.initialt + 'px';
    let childList = document.getElementsByClassName(this.list)
    for (let i = 0; i < childList.length; i++) {
        let res = checkIn(childList[i])
        if (res.isIn) {
            let obj = { ...res, fromId: this.oDiv.id }
            if (obj.fromId === "mark") {
                emitter.emit("setHead", obj)
            } else {
                emitter.emit("setFilter", obj)
            }
        }
    }
}

// 判断鼠标是否落在一个块级元素内部
function checkIn(obj) {
    var x = Number(window.event.clientX) // 鼠标相对屏幕横坐标
    var y = Number(window.event.clientY) // 鼠标相对屏幕纵坐标

    var div_x = Number(obj.getBoundingClientRect().left) // obj相对屏幕的横坐标
    var div_x_width = Number(
        obj.getBoundingClientRect().left + obj.clientWidth
    ) // obj相对屏幕的横坐标+width

    var div_y = Number(obj.getBoundingClientRect().top) // obj相对屏幕的纵坐标
    var div_y_height = Number(
        obj.getBoundingClientRect().top + obj.clientHeight
    ) // obj相对屏幕的纵坐标+height

    if (x > div_x && x < div_x_width && y > div_y && y < div_y_height) {
        return {
            isIn: true,
            idIn: obj.id
        }
    } else {
        return {
            isIn: false,
            idIn: obj.id
        }
    }
}
function creatTab(table, tr, td) {
    var div = document.getElementById(table);
    tr = tr > 9 ? 9 : tr
    if (td * 50 > 340) {
        let width = td * 50
        var tab = "<table class='create_table' width='" + width + "' border='1' cellspacing='0'>"
        for (var i = 0; i < tr + 1; i++) {
            tab = tab + "<tr>";
            if (i === 0) {
                for (var j = 0; j < td; j++) {
                    tab += "<td class='create_cell' width='50px' height='20px'>" + (j + 1) + "</td>";
                }
            } else if (i === 1) {
                for (var j = 0; j < td; j++) {
                    tab += "<td class='create_cell' width='50px' height='20px'><input id='input_" + j + "' class='table_input' value='' style='width: 98%; height: 90%;'></input></td>";
                }
            } else {
                for (var j = 0; j < td; j++) {
                    tab += "<td class='create_cell' width='50px' height='20px'></td>";
                }
            }
            tab += "<tr/>";
        }
        tab += '</table>';
    } else {
        var tab = "<table class='create_table' width='100%' border='1' cellspacing='0'>"
        for (var i = 0; i < tr + 1; i++) {
            tab = tab + "<tr>";
            if (i === 0) {
                for (var j = 0; j < td; j++) {
                    tab += "<td height='20px'>" + (j + 1) + "</td>";
                }
            } else if (i === 1) {
                for (var j = 0; j < td; j++) {
                    tab += "<td height='20px'><input id='input_" + j + "' class='table_input' value='' style='width: 98%; height: 90%;'></input></td>";
                }
            } else {
                for (var j = 0; j < td; j++) {
                    tab += "<td height='20px'></td>";
                }
            }
            tab += "<tr/>";
        }
        tab += '</table>';
    }
    div.innerHTML = tab;
}

export { Drag, DragTo, creatTab };