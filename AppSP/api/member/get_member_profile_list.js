var AWS = require("aws-sdk");
const uuid = require('uuid')

var collection = {

    post: function(req, res) {
        console.log('post hello');

        const reqPacket = req.body;
        const shop_key = reqPacket.key;

        var resPacket = {
            resultCode: -1,
            members: null
        }

        var docClient = new AWS.DynamoDB.DocumentClient();
        var query_params = {
            TableName: "superpower-db",

            KeyConditionExpression: '#doc_type_field = :doc_type_value',
           // FilterExpression: '#shop_id_field = :shop_id_value',
             FilterExpression: '#enroll.#shopKey= :shop_id_value',

            ExpressionAttributeNames: {
                "#doc_type_field": 'documentType',
               // '#shop_id_field': 'enroll.shopKey',
                '#enroll': 'enroll',
                '#shopKey' : 'shopKey'
            },
            ExpressionAttributeValues: {
                ':doc_type_value': 'member',
                ':shop_id_value': shop_key
            }
        };

        docClient.query(query_params, function(err, data) {
                if (err) {
                    console.log(JSON.stringify(err));
                    res.json(resPacket);
                }
                else {
                    console.log(JSON.stringify(data));
                    var members = Array();
                    
                    var items = data.Items;
                    items.forEach((e)=> {
                        members.push(e.profile);
                    });
                    
                    resPacket.resultCode = 0;
                    resPacket.members = members;
                    
                    res.json(resPacket);
                }
        });
    },

    get: function(req, res) {
        console.log('get hello');
        res.send("get hello world");
    },


    put: function(req, res) {
        console.log('put hello');
        res.send("put hello world");
    }
}

exports.collection = collection;
