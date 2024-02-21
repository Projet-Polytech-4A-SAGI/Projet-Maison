var debug = require('debug')('http')
  , http = require('http')
  , name = 'app.js';

debug("%o app.js : debut", name);
const controller = require('./Controller/controller.js');
const express = require('./Express/express.js');
const discord = require("./Discord/server.js");
debug("%o app.js : fin", name);