var dbConn = require('./mongoLib').dbConn;

var collection = {
    get : function(req, res)
    {
        console.log('get data');
        res.send("hello world");
    },

    post : function(req, res)
    {
        console.log('pose data');
        res.send("hello world");

    },

    put : function(req, res)
    {
        console.log('put data');
        res.send("hello world");
    }
}

exports.collection = collection;