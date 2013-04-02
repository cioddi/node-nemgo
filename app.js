var passport = require('passport');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var server = {};


server.init = function(){
	var db = mongoose.createConnection('localhost', 'test_db');

	var dbhandler = require('./node_modules/node-dbhandler/index.js');

	dbhandler.Schema = mongoose.Schema;
	dbhandler.db = db;

	// Create the database.
	app = express();

	app.configure(function(){
		app.use(express.bodyParser());
		app.use(express.static(path.join(__dirname, 'public')));
	});
	app.db = db;
	app.dbhandlers = {};

	server = require('http').createServer(app);	

	// model definitions
	var author = require('./model/author.js').register(dbhandler);
	var book = require('./model/book.js').register(dbhandler);


	server.listen(3000,function(){
		console.log('server started at port 3000');
	});
	return exports;
};

server.close = function(){

	  server.close()
}

server.init();