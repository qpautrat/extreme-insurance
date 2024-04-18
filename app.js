var CONFIGURATION_FILE = './configuration.json';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var services = require('./src/services');
var repositories = require('./src/repositories');
var routes = require('./src/routes');
var config = require('./src/config');


var configuration = new config.Configuration(CONFIGURATION_FILE);
var sellers = new repositories.Sellers();
var sellerService = new services.SellerService(sellers, configuration);
var orderService = new services.OrderService(configuration);
var dispatcher = new services.Dispatcher(sellerService, orderService, configuration);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes(sellerService, dispatcher));
app.use(express.static(path.join(__dirname, 'public')));

configuration.watch(function() {}, false, 500);
dispatcher.startBuying(1);

module.exports = app;