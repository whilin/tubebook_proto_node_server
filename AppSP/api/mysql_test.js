var mysql = require('mysql');
var dbConfig = require('../dbConfig');

var db = mysql.createConnection(dbConfig)

var collection = {
    get : function(req, res)
    {
        var sql = 'SELECT * from COMM_CD';
        db.query(sql, function(err, rows)
        {
            if(err) 
                throw err;

            console.log('The solution is: ', rows);
            res.send(rows);
        });
    },

    post : function(req, res)
    {
        console.log('pose data');
    },

    put : function(req, res)
    {
        console.log('put data');
    },

    delete : function(req, res)
    {
        
    }
}

exports.collection = collection;