
var http = require("https");
var fs = require("fs");

const API_KEY = 'AIzaSyApbo42yJQc2GyE02YxY4lZeIToMR75zBA';


function optionVideosQuery(videoKey) {

    const options = {
        hostname: 'www.googleapis.com',
        path: '/youtube/v3/videos?id=' + videoKey + '&part=snippet,contentDetails&fields=items(snippet,contentDetails)&key=' + API_KEY,
        method: 'GET',
        headers: {
            'Content-Type': 'text/html',
            'Accept': 'application/json'
        }
    };

    return options;
}


function optionChannelInfo(channelKey) {

    const options = {
        hostname: 'www.googleapis.com',//'developers.google.com',
        //  path :  '/apis-explorer/#p/youtube/v3/youtube.channels.list?part=snippet,contentDetails&id='+channelKey+'&key=' + API_KEY,
        path: '/youtube/v3/channels?part=snippet,contentDetails&id=' + channelKey + '&key=' + API_KEY + '&maxResults=50',
        //  path :'/youtube/v3/playlists?part=snippet,contentDetails&channelId='+channelKey+'&maxResults=50&key='+ API_KEY,

        method: 'GET',
        headers: {
            'Content-Type': 'text/html',
            'Accept': 'application/json'
        }
    };

    return options;
}

function getChannelPlaylist(channelKey, nextPageToken) {

    const options = {
        hostname: 'www.googleapis.com',//'developers.google.com',
        // path :  '/apis-explorer/#p/youtube/v3/youtube.channels.list?part=snippet,contentDetails&id='+channelKey+'&key=' + API_KEY,
        //  path :  '/youtube/v3/channels?part=snippet,contentDetails&id='+channelKey+'&key=' + API_KEY+'&maxResults=50',
        path: '/youtube/v3/playlists?part=snippet,contentDetails&channelId=' + channelKey + '&maxResults=50&key=' + API_KEY,

        method: 'GET',
        headers: {
            'Content-Type': 'text/html',
            'Accept': 'application/json'
        }
    };

    if (nextPageToken)
        options.path += '&pageToken=' + nextPageToken

    return options;
}

function optiopPlaylistByUploadId(updoadId, nextPageToken) {

    const options = {
        hostname: 'www.googleapis.com',//'developers.google.com',
        // path :  '/apis-explorer/#p/youtube/v3/youtube.channels.list?part=snippet,contentDetails&id='+channelKey+'&key=' + API_KEY,
        path: '/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=' + updoadId + '&key=' + API_KEY + '&maxResults=50',
        method: 'GET',
        headers: {
            'Content-Type': 'text/html',
            'Accept': 'application/json'
        }
    };

    if (nextPageToken)
        options.path += '&pageToken=' + nextPageToken

    return options;
}

function requestHttp(calloption, callback) {

    var msg = '';

    var req = http.request(calloption, function (res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');

        res.on('data', function (body) {

            msg += body;
            //callback(body);
        });
        res.on('end', function () {
            //console.log('Body: ' + msg);
            callback(msg);
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}


function fetchPlaylistByUploadId_page(uploadId, nextPageToken, callback) {

    requestHttp(optiopPlaylistByUploadId(uploadId,nextPageToken), function (body) {
        //console.log(body);
        var bodyObj = JSON.parse(body);

        if (bodyObj.nextPageToken) {
            console.log('fetchPlaylistByUploadId : ' + bodyObj.items.length);

            callback(bodyObj.items)
            fetchPlaylistByUploadId_page(uploadId, bodyObj.nextPageToken, callback)
        } else {
            callback(bodyObj.items);
            callback(null);
        }
    });
}

function fetchPlaylistByUploadId(channelId, callback) {

    var total = Array();

    requestHttp(optionChannelInfo(channelId), function (body) {

        const json = JSON.parse(body);
        const uploadId = json.items[0].contentDetails.relatedPlaylists.uploads;

        fetchPlaylistByUploadId_page(uploadId, null, function (items) {
            if (items) {
                items.forEach(element => {
                    total.push(element);
                });
            }
            else {
                console.log('fetchChannelPlaylist_uploadmethod : ' + total.length);
                callback(total);
            }
        });
    });
}

exports.fetchPlaylistByUploadId = fetchPlaylistByUploadId

/*
fetchPlaylistByUploadId('UCUH2DSbsNUz2sW3kBNn4ibw', function(items) {
    console.log("Total:"+items.length);

    fs.open("./result_2.json", 'w', function (err, fd) {
        if (err)
            console.error(err);

        const jsonString = JSON.stringify(items);
        fs.write(fd, jsonString, (err, written, string) => { });
    });

});
*/