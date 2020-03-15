var AWS = require('aws-sdk'); // To set the AWS credentials and region.
var async = require('async'); // To call AWS operations asynchronously.
const uuid = require("uuid");
const fs = require('fs');

//! Credentials 설정방법
//!     - 
AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
    console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
  }
});


AWS.config.update({
    region: "ap-northeast-2",
});
  
var bucket_name = 'superpowerpilates-pose-image';

const s3 = new AWS.S3();


let upload_cmd = {
    Bucket : bucket_name,
    Key : uuid().toString(),
   // ACL : 'public-read',
    Body : fs.createReadStream('s3_test_image.png'),
    ContentType : 'image/png'
};

/*
s3.upload(upload_cmd, function(err, data) {
    console.log(err);
    console.log(data);
})
*/

let list_cmd = {
     Bucket : bucket_name
};


s3.listObjects(list_cmd)
.on('success', function handle(response) {
    
    for(var name in response.data.Contents){
        console.log(response.data.Contents[name].Key);
    }
    if (response.hasNextPage()) {
        response.nextPage().on('success', handle).send();
    }
})
.on('fail', function handle(response) {
    
    console.log(response);
    
})
.send();

s3.getO