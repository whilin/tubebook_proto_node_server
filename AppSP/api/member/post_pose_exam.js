var AWS = require("aws-sdk");
const uuid = require('uuid')

function registerPostExamData(member, examKey, report) {

    var examData;

    if (!member.examHistory) {
        for (var i = 0; i < member.examHistory.length; i++) {
            if (member.examHistory[i].examKey == examKey) {
                examData = member.examHistory[i];
            }
        }
    } else {
        member.examHistory = Array();
    }

    if (!examData) {
        examData = {
            examKey: examKey,
            examDate:  Date().toISOString(),
            reports : Array()
        };
        
        member.examHistory.push(examData);
    }
    
    if(!examData.reports)
        examData.reports = Array();
   
    examData.reports.push(report);
   
    return examData;
}


var collection = {

    post: function(req, res) {
        console.log('post pose exam');

        const reqPacket = req.body;
        var resPacket = {
            resultCode: -1
        };

        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: "superpower-db",
            Key: {
                documentType: "member",
                documentId: reqPacket.key
            }
        };

        docClient.get(params, function(err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                res.json(resPacket);
            }
            else {
                console.log(JSON.stringify(data));

                const member = data.Item.member;
                registerPostExamData(member, reqPacket.examKey,  reqPacket.report);
                
                var update_param = {
                    TableName: "superpower-db",
                    Key: {
                        documentType: "member",
                        documentId: reqPacket.key
                    },
                    UpdateExpression : "set examHistory = :r",
                    ExpressionAttributeValues : {
                        ":r" : member.poseExamHistory
                    }
                };
                
                docClient.update(update_param, function(err, data) {
                
                    if(err) {
                        console.log(JSON.stringify(err));
                    }
                    else {
                        console.log(JSON.stringify(data));
                        resPacket.resultCode = 0;
                        //resPacket.member = data.Item;
                        res.json(resPacket);
                    }
                });
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
