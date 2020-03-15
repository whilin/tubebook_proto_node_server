var routes = require('../bc_modules/routes');
var express = require('express');

module.exports.mappingRouteTable = function InstallRouteTable(app) {
    routes(app)
        .defineRoutes('/mongoApi/:db/:collection/:cmd', require('./mongoApi'))
        //.defineRoutes('/mydb', require('./mongo_test')
        
        .map();
}
