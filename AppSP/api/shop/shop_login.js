var AWS = require("aws-sdk");
const uuid = require('uuid')


var collection = {
    
    post : function(req, res)
    {
        console.log('post shop_login');
        
        const reqPacket = req.body;
        const input_id = reqPacket.shop_id;
        const input_pw = reqPacket.shop_pw;
        
        var resPacket = {
            resultCode : -1,
            shopKey : '',
            shop : null
        }
       
        var docClient = new AWS.DynamoDB.DocumentClient();
        var query_params = {
            TableName: "superpower-db",
            
            KeyConditionExpression: '#doc_type_field = :doc_type_value',
            FilterExpression : '#shop_id_field = :shop_id_value',
            
            ExpressionAttributeNames:{
                "#doc_type_field": 'documentType',
                '#shop_id_field' : 'shopId'
            },
            ExpressionAttributeValues: {
                ':doc_type_value' : 'shop',
                ':shop_id_value' : input_id
            }
        };
        
        docClient.query(query_params, function(err, data) {
            if(err) {
                 console.log(JSON.stringify(err));
                res.json(resPacket);
            } else {
                console.log(JSON.stringify(data));
                
                const items = data.Items;
                
                if(data.Count == 0) {
                    resPacket.resultCode = -10;
                    res.json(resPacket);
                } else  if(data.Count > 1) {
                    resPacket.resultCode = -10;
                    res.json(resPacket);
                } else if(items[0].shopPw == input_pw) {
                    resPacket.resultCode = 0;
                    resPacket.shopKey = items[0].shopKey;
                    resPacket.shop = items[0];
                    res.json(resPacket);
                } else {
                    resPacket.resultCode = -11;
                    res.json(resPacket);
                }
            }
        });
        
    },
    
    get : function(req, res)
    {
        console.log('get hello');
        res.send("get hello world");
    },


    put : function(req, res)
    {
        console.log('put hello');
        res.send("put hello world");
    }
}

exports.collection = collection;