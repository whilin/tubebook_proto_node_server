var uuid = require("uuid");
var AWS = require('aws-sdk');
var fs = require("fs");

var debugMode = false;

function uploadImageFileToS3(bucket, imageKey, imageFile, callback) {

    const s3 = new AWS.S3();

    console.log('uploadImageFieldToS3 ${imageKey} imageKey');
    
    let upload_cmd = {
        Bucket: bucket,
        Key:'image/'+imageKey,
        // ACL : 'public-read',
        Body: fs.createReadStream(imageFile),
        //Body: Buffer(imageData),
        ContentType: 'image/jpg'
    };


    s3.upload(upload_cmd, function(err, data) {
        
        if(err)
            console.log(err);
            
        if(data)
            console.log(data);
        
        callback(err);
    });
}


function uploadDocumentToS3(bucket, docKey, document, callback) {

    const s3 = new AWS.S3();

    console.log('uploadDocumentToS3 ${docKey}');
    
    let upload_cmd = {
        Bucket: bucket,
        Key:'report/'+docKey,
        // ACL : 'public-read',
        Body: document,
        //Body: Buffer(imageData),
        ContentType: 'json'
    };


    s3.upload(upload_cmd, function(err, data) {
        
        if(err)
            console.log(err);
            
        if(data)
            console.log(data);
        
        callback(err);
    });
}


function getDocumentFromS3(bucket, docKey, callback) {

    const s3 = new AWS.S3();

    console.log('getDocumentFromS3 docKey:'+docKey);
    
    let get_cmd = {
        Bucket: bucket,
        Key:'report/'+docKey,
    };

    s3.getObject(get_cmd, function(err, data) {
        
        if(err) {
            console.log(err);
            callback(null);
        }
        else if(data) {
            //console.log(data);
            let jsonDoc = JSON.parse(data.Body.toString());
            //console.log(reportJson);
            callback(jsonDoc);
        }
    });
}


function getImageFromS3(bucket, imageKey, callback) {

    const s3 = new AWS.S3();

    console.log('getImageFromS3 key:'+imageKey);
    
    let get_cmd = {
        Bucket: bucket,
        Key:'image/'+imageKey,
    };


    s3.getObject(get_cmd, function(err, data) {
        
        if(err) {
            console.log(err);
             callback(null);
        }
        else if(data) {
            console.log(data);
            let imageBuffer = data.Body;
            // let jsonDoc = JSON.parse(data.Body.toString());
            //console.log(reportJson);
            callback(imageBuffer);
        }
    });
}

//! 정상 작동하지 않는 버전임, 저장이 되지만 이미지가 열리지 않음
function uploadImageBytesToS3(bucket, imageKey, imageBytes) {

    const s3 = new AWS.S3();

    //console.log("ImageKey >>"+imageKey);
    
    let upload_cmd = {
        Bucket: bucket,
        Key:'image/'+imageKey,
        // ACL : 'public-read',
       // Body: fs.createReadStream('s3_test_image.png'),
        Body: Buffer(imageBytes),
        ContentType: 'image/jpg'
    };


    s3.upload(upload_cmd, function(err, data) {
        if(err)
            console.log(err);
            
        if(data)
            console.log(data);
    });
}


function setDebug(on) {
    debugMode = on;
}

exports.setDebug = setDebug;
exports.uploadImageFileToS3 = uploadImageFileToS3;
exports.uploadImageBytesToS3 = uploadImageBytesToS3;
exports.uploadDocumentToS3 = uploadDocumentToS3;

exports.getDocumentFromS3 = getDocumentFromS3;
exports.getImageFromS3 = getImageFromS3;