process.env['app_dir'] = __dirname;

var express = require('express'),
    app = express.createServer(),
    lokki = require( __dirname +'/lib/lokki/index');

var config = require(__dirname+"/config/config");
config.setConfig(express, app);

lokki.initApp(app.name, express, app);
