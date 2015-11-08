var Telescope = require('./telescope.js');
var Config = require('./config.js');
var config = new Config().readConfiguration();

var SR = [0, 7, 15, 60, 120, 240, 960, 960, 960, 960];

var AZM = 16,
    ALT = 17,
    POS = 36,
    NEG = 37;

var http = require('http'),
    fs = require('fs'),
    index = fs.readFileSync(__dirname + '/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

var telescope = new Telescope(config.device);
telescope.start();

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

function chr(dec){
	return dec;
    return (dec >>> 0).toString(16);
};

var sendFixed = function(axis, direction, speed) {
	console.log('axis: ' + axis + ', direction: ' + direction + ', speed: ' + speed);
	var buf = new Buffer([chr(80), chr(2), chr(axis), chr(direction), chr(speed), chr(0), chr(0), chr(0)]);
	telescope.write(buf);
};

var sendVariable = function(axis, direction, speed) {
	var arcseconds = SR[speed];
	var high_byte = Math.floor((arcseconds * 4) / 256);
	var low_byte = (arcseconds * 4) % 256;
	console.log('high: ' + high_byte + ', low: ' + low_byte);
	var buf = new Buffer([chr(80), chr(3), chr(axis), chr(direction - 30), chr(high_byte), chr(low_byte), chr(0), chr(0)]);
	telescope.write(buf);
};

var send = function(axis, direction, speed) {
	sendFixed(axis, direction, speed);
};

var up = function(speed) {
	send(ALT, POS, speed.data);
};

var down = function(speed) {
	send(ALT, NEG, speed.data);
};

var left = function(speed) {
	send(AZM, NEG, speed.data);
};

var right = function(speed) {
	send(AZM, POS, speed.data);
};

var stop = function() {
	send(AZM, POS, 0);
	send(ALT, POS, 0);
};


// Emit welcome message on connection
io.on('connection', function(socket) {
    socket.on('up', up);
    socket.on('down', down);
    socket.on('left', left);
    socket.on('right', right);
    socket.on('stop', stop);
});

app.listen(config.port);
console.log('listening on port ' + config.port);
