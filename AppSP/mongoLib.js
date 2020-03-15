const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const connectionString = 'mongodb+srv://MongoAdmin:qawsedrf@cluster0-0nulo.gcp.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true';
const client = new MongoClient(connectionString);

var dbConn = {
}

client.connect(function(err) {
    console.log("Connected to mongoDB")
    
    dbConn.superDB = client.db('SuperDB')

    dbConn.superDB.collection("PlayerInfo").insertOne(
        {
            name : 'JongokLee',
            age : 33
        },
        function (err, result) {
            if (err == null)
            {
                console.log("Collection created..."+result)
            }
            else
                console.log(err)
        });
});

exports.dbConn = dbConn