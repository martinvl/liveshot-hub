var express = require('express');
var http = require('http');
var path = require('path');
var io = require('socket.io');

var ObjDist = require('objdist');
var ObjSync = require('objsync');

// --- Configuration ---
var PORT = 80;

// --- Setup express ---
var app = express();

var frontendPath = path.join(__dirname, 'frontend');
app.use(express.static(frontendPath));

var server = http.createServer(app);
server.listen(PORT);

// dist
// --- Setup socket.io ---
var transport = io.listen(server);

transport.set('log level', 0);

var dist = new ObjDist(transport, {prefix:'ranges'});
var sync = new ObjSync(transport, {delimiter:'/'});

var numUpdate = 0;
sync.on('update', function (updated) {
    console.info('Received update ' + (++numUpdate));

    for (var keypath in updated) {
        dist.setValueForKeypath(updated[keypath], keypath, true);
    }

    dist.commit();
});
