const s3Lib = require("../../s3Lib");
const fsLib = require("../../fsLib");
const config = require("../../awsConfig").config;


var collection = {
    get: function(req, res) {
        console.log('get data');
        //res.send("hello world");

        let param = req.body;
        let reportKey = param.reportKey;

        let Rst = {
            resultCode: 0,
            reportJson: null
        };

        s3Lib.getDocumentFromS3(config.report_bucket_name, reportKey,
            function(jsonDoc) {
                //let reportJson = JSON.parse(data.Body.toString())
                console.log(jsonDoc);

                if (jsonDoc) {
                    Rst.reportJson = jsonDoc;
                    res.json(Rst);
                }
                else {
                    Rst.resultCode = -1;
                    res.json(Rst);
                }
            });
    },

    post: function(req, res) {
        console.log('pose data');
        res.send("hello world");

    },

    put: function(req, res) {
        console.log('put data');
        res.send("hello world");
    }
}

exports.collection = collection;
