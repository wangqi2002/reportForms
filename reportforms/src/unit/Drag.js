function Drag(id) {
    this.oDiv = document.getElementById(id);
    var _this = this;
    this.oDiv.onmousedown = function (ev) {
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

    if (l <= 0) {
        l = 0;
    }
    var windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
    if (l >= windowWidth - this.oDiv.offsetWidth) {
        l = windowWidth - this.oDiv.offsetWidth;
    }

    if (t <= 0) {
        t = 0;
    }
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (t >= windowHeight - this.oDiv.offsetHeight) {
        t = windowHeight - this.oDiv.offsetHeight;
    }

    this.oDiv.style.left = l + 'px';
    this.oDiv.style.top = t + 'px';

}

Drag.prototype.funcUp = function (ev) {
    document.onmousemove = null;
}

export default Drag;