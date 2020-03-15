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


var shopDoc = {
    shopKey : uuid().toString(),
    shopId : 'bravecompany',
    shopPw : '1234',
    shopName : 'BRAVE PILATES 강남역점',
    shopDesc : '정신력 강화를 위한 뇌 필라테스 전문',
}

var put_params = {
    TableName: "superpower-db",
    Item: {
        "documentType" : "shop",
        "documentId": shopDoc.shopKey,
    }
};


put_params.Item = {...put_params.Item, ...shopDoc};

var docClient = new AWS.DynamoDB.DocumentClient();

//! 새로운 아이템 추가, 키가 같을 경우, overwrite 처리됨!
docClient.put(put_params, function(err, data) {
   if (err) {
       console.error("PutItem Error:", JSON.stringify(err, null, 2));
   } else {
       console.log("PutItem succeeded:", JSON.stringify(data));
   }
});

