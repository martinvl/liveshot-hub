var io = require('socket.io-client');
var LiveShot = require('liveshot-dom');
var ObjSync = require('objsync');

var rangeView = new LiveShot.MegalinkRangeView();

try { // XXX
    G_vmlCanvasManager.initElement(cardView.el);
} catch(err) {}

rangeView.el.style.overflow = 'hidden';
document.body.appendChild(rangeView.el);

updateSize();
window.onresize = updateSize;

// --- Setup server connection ---
var socket = io.connect('http://' + window.location.host + '/ranges');

socket.on('error', function () {
    socket.socket.reconnect();
});

var syncer = new ObjSync(socket, {delimiter:'/'});
var rangeNumber = parseInt(window.location.search.substring(1)) || 0;

syncer.on('update', function () {
    var range = syncer.getObject()[rangeNumber];
    rangeView.setRange(range);
});

function updateSize() {
    var width = window.innerWidth || document.documentElement.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight;
    rangeView.el.style.width = width + 'px';
    rangeView.el.style.height = height + 'px';

    rangeView.updateSize();
    rangeView.draw();
}
