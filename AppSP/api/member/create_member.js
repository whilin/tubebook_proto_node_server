var AWS = require("aws-sdk");
const uuid = require('uuid')

var collection = {
    post: function(req, res) {
        console.log('get hello');

        // res.send("get hello world");

        const reqPacket = req.body;
        const inputProfile = reqPacket.inputProfile;
        const shopKey =  reqPacket.key;
        
        const memberKey = uuid().toString();
        const memberDoc = {
            memberKey: memberKey,
            enroll : {
                shopKey : shopKey
            },
            profile: {
                memberKey: memberKey,
                created: new Date().toISOString(),
                name : inputProfile.name
            }
        };

        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: "superpower-db",
            Item: {
                documentType: "member",
                documentId: memberKey,
                //member: memberDoc
            }
        };
        
        params.Item = {...params.Item, ...memberDoc};

        var Rst = {
            resultCode: 0,
            key: memberDoc.memberKey,
            profile : memberDoc.profile
        };

        //! 새로운 아이템 추가, 키가 같을 경우, overwrite 처리됨!
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Error JSON:", JSON.stringify(err, null, 2));
                
                Rst.resultCode = -1;
                res.json(Rst);
            }
            else {
                console.log("PutItem succeeded:", data);
                
                res.json(Rst);
            }
        });

    },

    get: function(req, res) {
        console.log('post hello');
        res.send("post hello world");

    },

    put: function(req, res) {
        console.log('put hello');
        res.send("put hello world");
    }
}

exports.collection = collection;
