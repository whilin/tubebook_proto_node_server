var AWS = require("aws-sdk");
const uuid = require('uuid')


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
    endpoint: "https://dynamodb.ap-northeast-2.amazonaws.com"
});


var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: "superpower-db",
    Item: {
        "documentType" : "test",
        "documentId": uuid().toString(),
        "test_field" : 451
    }
};

//! 새로운 아이템 추가, 키가 같을 경우, overwrite 처리됨!
docClient.put(params, function(err, data) {
   if (err) {
       console.error("Error JSON:", JSON.stringify(err, null, 2));
   } else {
       console.log("PutItem succeeded:", params.Item.documentId);
   }
});

