/*
 * (C) Copyright 2014 Travis Miller (http://raceconditions.net/).
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 */

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var serialport = require('serialport');

var Telescope = function(device) {

    var self = this;
    self.lastCommand = '';

    var serialDevice = new serialport.SerialPort(device, {
	baudrate: 9600,
	parser: serialport.parsers.raw
    }, false); // this is the openImmediately flag [default is true]

    this.start = function() {
	serialDevice.open(function () {
	    console.log('OPENED serial connection to device:', device);
	});

	serialDevice.on('data', function(buffer){
		console.log(buffer);
		self.emit('data', buffer);
	});
    };

    this.stop = function() {
	serialDevice.close(function() {
	    console.log('CLOSED serial connection to device:', device);
	});
    };

    this.write = function(buffer) {
	serialDevice.write(buffer, function(err){
	    if(err != undefined) 
		console.log(err);
	});
    };

};

util.inherits(Telescope, EventEmitter);

module.exports = Telescope;
