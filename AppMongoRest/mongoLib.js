const mongodb  = require('mongodb');
const assert  = require('assert');


function toInsertQuery(req) {
    return {
        db : req.params.db,
        collection : req.params.collection,
        docs :  req.body.docs,
    };
}

function toFindQuery(req) {
    
    return {
        db : req.params.db,
        collection : req.params.collection,
        where :  req.body.where,
        sort : req.body.sort
    };
}

function toDeleteQuery(req) {
    return {
        db : req.params.db,
        collection : req.params.collection,
        where :  {
            _id : req.body.id
        },
    };
}

function toUpdateQuery(req) {
    return {
        db : req.params.db,
        collection : req.params.collection,
        where :  {
            _id : req.body.id
        },
        
        set : { $set: req.body.set }
    };
}

const url = 'mongodb://13.124.95.20:27017';

function connectToDB(callback) {

    const client = new mongodb.MongoClient(url);

    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");


        callback(client);
    });
}


module.exports.insertQuery = function insertQuery(req, callback) {
    
    const query = toInsertQuery(req);

    connectToDB((client) => {

    const db = client.db(query.db);
        db.collection(query.collection).insertMany(query.docs, function(err,r ) {
            if(err) 
                callback(err, r);
            else {
                console.log('insertQuery insertedCount:'+r.insertedCount)
                client.close();
                callback(err, r);
            }
        });
    });
}



module.exports.insertDocuments = function insertDocuments(req, callback) {
    
    const query = toInsertQuery(req);

    connectToDB((client) => {

        const db = client.db(query.db);
        db.collection(query.collection).insertMany(query.docs, function(err,r ) {
            if(err) {
                console.log('insertQuery error:'+error)
                callback(err, r);
            }
            else {
                console.log('insertQuery result:'+r)
                client.close();
                callback(err, r);
            }
        });
    });
}

module.exports.updateDocument =  function updateDocument(req, callback) {
    
    const query = toUpdateQuery(req);

    connectToDB((client, db) => {
        db.collection(query.collection).updateOne(query.where, function(err,r ) {
            if(err) {
                console.log('insertQuery error:'+error)
                callback(err, r);
            }
            else {
                console.log('insertQuery result:'+r.insertedCount)
                client.close();
                callback(err, r);
            }
        });
    });
}


module.exports.readDocument =  function readDocument(req, callback) {
    
    const query = toFindQuery(req);

    connectToDB((client, db) => {
        db.collection(query.collection).findOne(query.where, function(err,r ) {
            if(err) {
                console.log('readDocument error:'+error)
                callback(err, r);
            }
            else {
                console.log('readDocument result:'+r)
                client.close();
                callback(err, r);
            }
        });
    });
}




