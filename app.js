var debug = require('debug')('app.js');

debug("debut");
const controller = require('./Controller/controller.js');
const express = require('./Express/express.js');
const discord = require("./Discord/server.js");
debug("fin");