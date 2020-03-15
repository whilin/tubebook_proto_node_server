const s3Lib = require("../../s3Lib");
const fsLib = require("../../fsLib");
const config = require("../../awsConfig").config;

var collection = {
    get : function(req, res)
    {
        console.log('get data');

        let param = req.body;
        let imageKey = param.imageKey;

        s3Lib.getImageFromS3(config.report_bucket_name, imageKey,
            function(imageBuffer) {
                //let reportJson = JSON.parse(data.Body.toString())
               // console.log(jsonDoc);

                if (imageBuffer) {
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    res.write(imageBuffer, 'binary');
                    res.end(null, 'binary');
                }
                else {
                    res.status(500).send("Image Not Found:"+imageKey);
                }
            });
    },

    post : function(req, res)
    {
        console.log('pose data');
        res.send("hello world");

    },

    put : function(req, res)
    {
        console.log('put data');
        res.send("hello world");
    }
}

exports.collection = collection;