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




  const shop_id = 'bravecompany';
  const shop_pw = '1234';



  var docClient = new AWS.DynamoDB.DocumentClient();
  var query_params = {
    TableName: "superpower-db",

    KeyConditionExpression: '#type_field = :type_value',
    FilterExpression: '#shop_id_field = :shop_id_value',

    ExpressionAttributeNames: {
      '#type_field': 'documentType',
      '#shop_id_field': 'shopId'
    },
    ExpressionAttributeValues: {
      ':type_value': 'shop',
      ':shop_id_value': shop_id
    }
  };

  var query_params2 = {
    TableName: "superpower-db",

    KeyConditionExpression: '#doc_type_field = :doc_type_value',
    FilterExpression: '#enroll.#shopKey= :shop_id_value',

    ExpressionAttributeNames: {
      "#doc_type_field": 'documentType',
      //'#shop_id_field': 'enroll.shopKey'
      '#enroll': 'enroll',
      '#shopKey' : 'shopKey'
    },
    ExpressionAttributeValues: {
      ':doc_type_value': 'member',
      ':shop_id_value': '716bdea0-9e13-403f-b853-c31771b0e9a4'
    }
  };

  docClient.query(query_params2, function(err, data) {
    if (err) {
      console.log(JSON.stringify(err));

    }
    else {
      console.log(JSON.stringify(data));

      const items = data.items;

    }
  });
  