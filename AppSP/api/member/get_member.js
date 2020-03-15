var AWS = require("aws-sdk");
const uuid = require('uuid')

var collection = {
    post : function(req, res)
    {
        console.log('post hello');
        
        const reqPacket = req.body;
        var resPacket = {
            resultCode : -1,
            member : null
        }
       
        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: "superpower-db",
            Key: {
                documentType: "member",
                documentId: reqPacket.key
            }
        };
        
        docClient.get(params, function(err, data) {
            if(err) {
                 console.log(JSON.stringify(err));
                res.json(resPacket);
            } else {
                console.log(JSON.stringify(data));
                
                resPacket.resultCode = 0;
                resPacket.member = data.Item;
                res.json(resPacket);
            }
        });
    },

    get : function(req, res)
    {
        console.log('post hello');
        res.send("post hello world");

    },

    put : function(req, res)
    {
        console.log('put hello');
        res.send("put hello world");
    }
}

exports.collection = collection;