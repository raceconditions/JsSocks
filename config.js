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

var fs = require('fs');

var Config = function() {

    self = this;

    this.readConfiguration = function() {
	var configData = fs.readFileSync('./config.json');
	
	try {
	    config = JSON.parse(configData);
	    return config;
	}
	catch (err) {
	    console.log('ERROR parsing configuration file.', err);
	    process.exit(2);
	}
    };
};

module.exports = Config;
