import emitter from './mittBus'

function Drag(outId, inId) {
    this.oDiv = document.getElementById(outId)
    this.iDiv = document.getElementById(inId)
    this.oDiv.oncontextmenu = () => false
    var _this = this
    this.iDiv.onmousedown = function (ev) {
        _this.funcDown(ev)
    }
    document.onmouseup = this.funcUp
}

Drag.prototype.funcDown = function (ev) {
    var e = ev || window.event
    this.offsetX = e.clientX - this.oDiv.offsetLeft
    this.offsetY = e.clientY - this.oDiv.offsetTop

    var _this = this
    document.onmousemove = function (ev) {
        _this.funcMove(ev)
    }
}

Drag.prototype.funcMove = function (ev) {
    var e = ev || window.event
    var l = e.clientX - this.offsetX
    var t = e.clientY - this.offsetY
    var windowWidth = document.documentElement.clientWidth || document.body.clientWidth
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
    if (e.clientX > 0 && e.clientX < windowWidth) {
        this.oDiv.style.left = l + 'px'
    }
    if (e.clientY > 0 && e.clientY < windowHeight) {
        this.oDiv.style.top = t + 'px'
    }
}

Drag.prototype.funcUp = function (ev) {
    document.onmousemove = null
}

function DragTo(id, list) {
    this.initialArr = {
        initiall: null,
        initialt: null,
    }
    this.oDiv = document.getElementById(id)
    this.list = list
    this.oDiv.oncontextmenu = () => false
    var _this = this
    this.oDiv.onmousedown = function (ev) {
        _this.funcDown(ev)
    }
    this.oDiv.onmouseup = function (ev) {
        _this.funcUp(ev)
    }
}

DragTo.prototype.funcDown = function (ev) {
    var e = ev || window.event
    this.offsetX = e.clientX - this.oDiv.offsetLeft
    this.offsetY = e.clientY - this.oDiv.offsetTop
    var l = e.clientX - this.offsetX
    var t = e.clientY - this.offsetY
    this.initialArr = {
        initiall: l,
        initialt: t,
    }
    var _this = this
    document.onmousemove = function (ev) {
        _this.funcMove(ev)
    }
}

DragTo.prototype.funcMove = function (ev) {
    var e = ev || window.event
    var l = e.clientX - this.offsetX
    var t = e.clientY - this.offsetY

    this.oDiv.style.left = l + 'px'
    this.oDiv.style.top = t + 'px'
}

DragTo.prototype.funcUp = function (ev) {
    document.onmousemove = null
    this.oDiv.style.left = this.initialArr.initiall + 'px'
    this.oDiv.style.top = this.initialArr.initialt + 'px'
    let childList = document.getElementsByClassName(this.list)
    for (let i = 0; i < childList.length; i++) {
        let res = checkIn(childList[i])
        if (res.isIn) {
            let obj = { ...res, fromId: this.oDiv.id }
            console.log(res, obj)
            if (obj.fromId === 'mark') {
                emitter.emit('setHead', obj)
            } else {
                emitter.emit('setFilter', obj)
            }
        }
    }
}

// 判断鼠标是否落在一个块级元素内部
function checkIn(obj) {
    var x = Number(window.event.clientX) // 鼠标相对屏幕横坐标
    var y = Number(window.event.clientY) // 鼠标相对屏幕纵坐标

    var div_x = Number(obj.getBoundingClientRect().left) // obj相对屏幕的横坐标
    var div_x_width = Number(obj.getBoundingClientRect().left + obj.clientWidth) // obj相对屏幕的横坐标+width

    var div_y = Number(obj.getBoundingClientRect().top) // obj相对屏幕的纵坐标
    var div_y_height = Number(obj.getBoundingClientRect().top + obj.clientHeight) // obj相对屏幕的纵坐标+height

    if (x > div_x && x < div_x_width && y > div_y && y < div_y_height) {
        obj.style.backgroundColor = '#d9c9c9'
        return {
            isIn: true,
            idIn: obj.id,
        }
    } else {
        return {
            isIn: false,
            idIn: obj.id,
        }
    }
}
function creatTab(table, tr, td) {
    var div = document.getElementById(table)
    tr = tr > 2 ? 2 : tr
    if (td * 50 > 340) {
        let width = td * 50
        var tab = "<table class='create_table' width='" + width + "' border='1' cellspacing='0'>"
        for (var i = 0; i < 2; i++) {
            tab = tab + '<tr>'
            if (i === 0) {
                for (var j = 0; j < td; j++) {
                    tab += "<td class='create_cell' width='50px' height='20px'>" + (j + 1) + '</td>'
                }
            } else if (i === 1) {
                for (var j = 0; j < td; j++) {
                    tab +=
                        "<td class='create_cell' width='50px' height='20px'><input id='input_" +
                        j +
                        "' class='table_input' value='' style='width: 98%; height: 90%;'></input></td>"
                }
            }
            // else {
            //     for (var j = 0; j < td; j++) {
            //         tab += "<td class='create_cell' width='50px' height='20px'></td>"
            //     }
            // }
            tab += '<tr/>'
        }
        tab += '</table>'
    } else {
        var tab = "<table class='create_table' width='100%' border='1' cellspacing='0'>"
        for (var i = 0; i < 2; i++) {
            if (i === 0) {
                tab = tab + '<tr>'
                for (var j = 0; j < td; j++) {
                    tab += "<td height='20px'>" + (j + 1) + '</td>'
                }
            } else if (i === 1) {
                tab += '<tr id="button-wrapper">'
                for (var j = 0; j < td; j++) {
                    tab +=
                        "<td height='20px' id='input_td_" +
                        j +
                        "'><button id='input_" +
                        j +
                        "' class='table_input' value='' style='width: 98%; height: 90%;'></button></td>"
                }
            }
            // else {
            //     for (var j = 0; j < td; j++) {
            //         tab += "<td height='20px'></td>"
            //     }
            // }
            tab += '<tr/>'
        }
        tab += '</table>'
    }
    div.innerHTML = tab
    window.tdFilled = new Map()
    window.tdFilled.clear()
    window.tdCount = 0

    emitter.on('tdFill', (text) => {
        if (window.tdFilled) {
            if (!window.tdFilled.has(text)) {
                let tdInput = document.getElementById('input_' + String(window.tdCount))
                let tdbtn = document.getElementById('input_td_' + String(window.tdCount))
                tdInput.value = text
                tdInput.innerText = text
                emitter.emit('setHead', { idIn: 'input_' + String(window.tdCount) })
                tdInput.draggable = true
                tdInput.ondblclick = (e) => {
                    window.tdCount = 0
                    window.tdFilled.delete(e.target.value)
                    tdInput.value = ''
                    tdInput.innerText = ''
                    tdInput.style.backgroundColor = '#e9e9e9'
                    emitter.emit('deleteColumn', { idIn: tdInput.id })
                }
                tdbtn.ondragstart = onDragStart
                tdbtn.ondragover = onDragOver
                tdbtn.ondrop = onDrop
                tdbtn.ondragenter = (e) => {
                    e.preventDefault()
                    e.target.style.backgroundColor = '#bdffee'
                }
                tdbtn.ondragleave = (e) => {
                    e.target.style.backgroundColor = '#e9e9e9'
                }
                window.tdFilled.set(text, text)
                window.tdCount++
                if (window.tdCount >= td) {
                    window.tdFilled.clear()
                    window.tdCount--
                }
            }
        }
    })
}

let dragElement = null
function onDragStart(e) {
    // 获取当前拖拽元素
    dragElement = e.target
}
function onDragOver(e) {
    // 默认的当你dragover的时候会阻止你做drop的操作，所以需要取消这个默认
    e.preventDefault()
}
function onDrop(e) {
    // 当拖动结束的时候，给拖动div所在的位置下面的div做drop事件
    if (dragElement) {
        // console.log(dragElement.id, e.target.id)
        let dropItem = document.getElementById(e.target.id)
        let storage = dragElement.value
        dragElement.value = dropItem.value
        dragElement.innerText = dropItem.innerText
        dropItem.value = storage
        dropItem.innerText = storage
        e.target.style.backgroundColor = '#e9e9e9'
        emitter.emit('changeColumn', {
            drag: dragElement.id,
            drop: e.target.id
        })
    }
}

export { Drag, DragTo, creatTab }
