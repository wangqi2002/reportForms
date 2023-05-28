function Drag(outId, inId) {
    this.oDiv = document.getElementById(outId);
    this.iDiv = document.getElementById(inId);
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

export default Drag;