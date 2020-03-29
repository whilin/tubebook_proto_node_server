const youtubeLib = require('./youtubechannel');
const fs = require('fs')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

/*
// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});
*/

//const url = 'mongodb://localhost:27017';
//const url = 'mongodb://13.124.95.20:27017';
const url = "mongodb://bookAdmin2:qawsedrf@13.124.95.20:27017:27017/?authSource=MyTubeBook";

const dbName = 'MyTubeBook';
const videoCollection = 'VideoCollection'

function connectToDB(callback) {

    const client = new MongoClient(url);

    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        callback(client, db);
    });
}

function uploadVideoCollection(videos) {
    connectToDB(function(client, db) {
        const collection = db.collection(videoCollection);

        collection.insertMany(videos, function(err, result) {
            assert.equal(null, err);
            client.close();
        });
    });
}


function uploadVideoCollection2(videos) {
    connectToDB(function(client, db) {
        const collection = db.collection(videoCollection);

        videos.forEach((e) => {
            collection.updateOne({
                videoKey: e.videoKey
            }, { $set: e }, { upsert: true }, function(err, result) {
                assert.equal(null, err);
            });
        });

        client.close();
    });
}

function findChannels(callback) {
    connectToDB(function(client, db) {
        const collection = db.collection('ChannelCollection');

        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log(docs)
            callback(docs);
            client.close();
        });
    });
}


module.exports.findChannel = function findChannel(channelId, callback) {

    youtubeLib.fetchPlaylistByUploadId(channelId, function(items) {
        console.log("Total Youtube Videos:" + items.length);

        var videos = Array();
        items.forEach((e) => {
            var video = {
                videoKey: e.contentDetails.videoId,
                title: e.snippet.title,
                description: e.snippet.description,
                channelId: e.snippet.channelId
            }
            videos.push(video);
        });

        uploadVideoCollection2(videos);
        
        callback(null);
    })
}

module.exports.findAllChannel = function findAllChannel() {

    findChannels(function(docs) {

        for (var i = 0; i < docs.length; i++) {
            youtubeLib.fetchPlaylistByUploadId(docs[i].channelId, function(items) {
                console.log("Total Youtube Videos:" + items.length);

                var videos = Array();
                items.forEach((e) => {
                    var video = {
                        videoKey: e.contentDetails.videoId,
                        title: e.snippet.title,
                        description: e.snippet.description,
                        channelId: e.snippet.channelId
                    }
                    videos.push(video);
                });

                uploadVideoCollection2(videos);
            })
        }
    });
}


/*
youtubeLib.fetchPlaylistByUploadId('UCUH2DSbsNUz2sW3kBNn4ibw', function (items) {
    console.log("Total:" + items.length);

    fs.open("./result_2.json", 'w', function (err, fd) {
        if (err)
            console.error(err);

        var videos = Array();

        items.forEach((e) => {
            var video = {
                videoKey: e.contentDetails.videoId,
                title: e.snippet.title,
                description: e.snippet.description,
                channelId: e.snippet.channelId
            }
            videos.push(video);
        });

        uploadVideoCollection(videos);

        // const jsonString = JSON.stringify(items);
        // fs.write(fd, jsonString, (err, written, string) => { });
    });

});
*/

/*
const client = new MongoClient(url);
client.connect().then((db)=>{
    const collection = db.collection('ChannelCollection');
}).then()

const collection = db.collection('ChannelCollection');
const  list = await collection.find({});
console.log(list);
await db.close();
*/
