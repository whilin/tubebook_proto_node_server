var AWS = require("aws-sdk");
const uuid = require('uuid');


var collection = {

    post: function(req, res) {
        console.log('post hello');

        const reqPacket = req.body;
        const memberKey = reqPacket.key;
        const profile = reqPacket.profile;

        var resPacket = {
            resultCode: -1
        }

        var update_param = {
            TableName: "superpower-db",
            Key: {
                documentType: "member",
                documentId: memberKey
            },
            UpdateExpression: "set profile = :r",
            ExpressionAttributeValues: {
                ":r": profile
            }
        };
        
        var docClient = new AWS.DynamoDB.DocumentClient();

        docClient.update(update_param, function(err, data) {

            if (err) {
                console.log(JSON.stringify(err));
            }
            else {
                console.log(JSON.stringify(data));
                resPacket.resultCode = 0;
                //resPacket.member = data.Item;
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
};


exports.collection = collection;
