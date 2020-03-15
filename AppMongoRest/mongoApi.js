//const mongoLib = require('./mongoLib')
const mongodb = require('mongodb');
const assert = require('assert');

const url = 'mongodb://13.124.95.20:27017';

function connectToDB(callback) {

    const client = new mongodb.MongoClient(url);

    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to:"+url);
        callback(client);
    });
}


function insertOne(req, callback) {

    const query = {
        db: req.params.db,
        collection: req.params.collection,
        doc: req.body.doc,
    };

    connectToDB((client) => {

        const db = client.db(query.db);
        db.collection(query.collection).insertOne(query.doc, function(err, r) {
            if (err) {
                console.log('insertOne error:' + err)
                callback(err, r);
            }
            else {
                console.log('insertOne result:' + JSON.stringify(r))
                client.close();
                callback(err, r);
            }
        });
    });
}

function insertMany(req, callback) {

    const query = {
        db: req.params.db,
        collection: req.params.collection,
        docs: req.body.docs,
    };


    connectToDB((client) => {

        const db = client.db(query.db);
        db.collection(query.collection).insertMany(query.docs, function(err, r) {
            if (err) {
                console.log('insertMany error:' + err);
                callback(err, r);
            }
            else {
                console.log('insertMany result:' + JSON.stringify(r));
                client.close();
                callback(err, r);
            }
        });
    });
}

function findOneAndUpdate(req, callback) {

    const query = {
        db: req.params.db,
        collection: req.params.collection,
        where: req.body.where,
        op: { $set: req.body.set }
        // set : { $set: req.body }
    };

    if (query.where._id)
        query.where._id = mongodb.ObjectId(query.where._id);

    delete query.op.$set._id;

    connectToDB((client) => {
        const db = client.db(query.db);
        db.collection(query.collection).findOneAndUpdate(query.where, query.op, { upsert: true }, function(err, r) {
            if (err) {
                console.log('findOneAndUpdate error:' + err)
                callback(err, r);
            }
            else {
                console.log('findOneAndUpdate result:' + JSON.stringify(r))
                client.close();
                callback(err, r);
            }
        });
    });
}


function findOneAndDelete(req, callback) {

    const query = {
        db: req.params.db,
        collection: req.params.collection,
        where: req.body.where,
        // op : { $set :  req.body.set }
        // set : { $set: req.body }
    };

    if (query.where._id)
        query.where._id = mongodb.ObjectId(query.where._id);

    // delete query.op.$set._id;

    connectToDB((client) => {
        const db = client.db(query.db);
        db.collection(query.collection).findOneAndDelete(query.where, function(err, r) {
            if (err) {
                console.log('findOneAndDelete error:' + err)
                callback(err, r);
            }
            else {
                console.log('findOneAndDelete result:' + JSON.stringify(r))
                client.close();
                callback(err, r);
            }
        });
    });
}


function find(req, callback) {

    const query = {
        db: req.params.db,
        collection: req.params.collection,
        where: req.body.where,
        page: req.body.page,
        // set : req.body.set
        // set : { $set: req.body }
    };

    connectToDB((client) => {
        const db = client.db(query.db);

        // var chain = db.collection(query.collection).find(query.where);
        // if(query.page)
        //     chain.sort({_id: -1}).limit(query.page.pageCount);
        var chain = db.collection(query.collection).find(query.where);
        if (query.page)
            chain.skip(query.page.page * query.page.pageCount).limit(query.page.pageCount);


        //  chain.limit(10)
        //  db.collection(query.collection).find(query.where).limit(10).toArray(function (err, r) {

        chain.toArray(function(err, r) {
            if (err) {
                console.log('find error:' + err);
                callback(err, r);
            }
            else {
                console.log('find result:' + JSON.stringify(r));
                client.close();
                callback(err, r);
            }
        });
    });

}


function count(req, callback) {

    const query = {
        db: req.params.db,
        collection: req.params.collection,
        where: req.body.where,
        //page : req.body.page,
        // set : req.body.set
        // set : { $set: req.body }
    };

    connectToDB((client) => {

        const db = client.db(query.db);
        var chain = db.collection(query.collection).find(query.where);

        chain.count(function(err, r) {
            if (err) {
                console.log('count error:' + err);
                client.close();
                callback(err, r);
            }
            else {
                console.log('count result:' + JSON.stringify(r));
                const rst = {
                    count: parseInt(r)
                };
                client.close();
                callback(err, rst);
            }
        });
    });

}



function group(req, callback) {

    const query = {
        db: req.params.db,
        collection: req.params.collection,
        group: {
            '$group' : req.body.group
        },
        project : {
            '$project' : req.body.project
        }
        
        //page : req.body.page,
        // set : req.body.set
        // set : { $set: req.body }
    };

    connectToDB((client) => {

        const db = client.db(query.db);
        var chain = db.collection(query.collection).aggregate([query.group, query.project]);

        chain.toArray(function(err, r) {
            if (err) {
                console.log('group error:' + err);
                callback(err, r);
            } else {
                console.log('group result:' + JSON.stringify(r));
                client.close();
                callback(err, r);
            }
        });
    });

}


const apiMap = {
    'insertOne': insertOne,
    'insertMany': insertMany,
    'find': find,
    'findOneAndUpdate': findOneAndUpdate,
    'findOneAndDelete': findOneAndDelete,
    'count': count,
    'group' : group
}



function reponse(res, err, r) {
    if (err)
        res.send(err);
    else
        res.json(r);
}


var collection = {

    //create
    post: function(req, res) {
        console.log('POST ' + req.path);

        const cmd = req.params.cmd;
        
        if(apiMap.hasOwnProperty(cmd)) {
            
            apiMap[cmd](req, (err, r) => {
                reponse(res, err, r);
            });
            
        } else {
            res.status(404).send('unknown command :' + cmd);
        }
        
        /*
        switch (cmd) {
            case 'insertOne':
                {
                    insertOne(req, (err, r) => {
                        repose(res, err, r);
                    });
                }
                break;
            case 'insertMany':
                {
                    insertMany(req, (err, r) => {
                        repose(res, err, r);
                    });
                }
                break;
            case 'find':
                {
                    find(req, (err, r) => {
                        repose(res, err, r);
                    });
                }
                break;
            case 'findOneAndUpdate':
                {
                    findOneAndUpdate(req, (err, r) => {
                        repose(res, err, r);
                    });
                }
                break;
            case 'findOneAndDelete':
                {
                    findOneAndDelete(req, (err, r) => {
                        repose(res, err, r);
                    });
                }
                break;
            case 'count':
                {
                    count(req, (err, r) => {
                        repose(res, err, r);
                    });
                }
                break;
            default:
                {
                    res.send('unknown command :' + cmd);
                }
                break;
        };
        */
    },
}

exports.collection = collection;
