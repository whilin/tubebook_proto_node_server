const formidable = require('formidable');
const s3Lib = require("../../s3Lib");
const fsLib = require("../../fsLib");
const config = require("../../awsConfig").config;


function inspectFormData(fields, files) {
    let keys = Object.keys(fields)
    console.log("field keys :" + keys + ", file keys:" + Object.keys(files));
}

function inspectStoredData(reportData) {
    s3Lib.getDocumentFromS3(config.report_bucket_name, reportData.reportKey, function(jsonDoc) {
        // let reportJson = JSON.parse(data.Body.toString())
        console.log(jsonDoc);
    });

    s3Lib.getImageFromS3(config.report_bucket_name, reportData.inputImageKey, function(imageBuffer) {

        //for test!!
        fsLib.saveBinaryDataToFile('./temp/'+reportData.inputImageKey+'.jpg', imageBuffer);
    });
}


var collection = {
    get: function(req, res) {
        
    },

    post: function(req, res) {
        console.log('upload_pose_report.post');

        var Res = {
            resultCode: 0
        };

        const form = formidable({ multiples: true });

        form.parse(req, function(err, fields, files) {

            if (err) {
                console.log(err);
                Res.resultCode = -1;
                res.json(Res);
                return;
            }

            inspectFormData(fields, files);

            let reportData = JSON.parse(fields.reportData);

            //console.log('reportData >>> ' + reportData);
            // saveBinaryDataToLocal(fields.originImage);
            //uploadImageToS3(reportData.inputImageKey, fields.originImage)
            //console.log('reportData >>> ' + fields.reportData);
            //console.log('originImage >>> ' + files.originImage);
            //console.log('originImage >>> ' + fields.originImage);
            //saveImageToLocal(files.originImage);

            s3Lib.uploadImageFileToS3(config.report_bucket_name, reportData.inputImageKey, files.originImage.path,
                function(err) {
                    if (!err) {
                        s3Lib.uploadDocumentToS3(config.report_bucket_name, reportData.reportKey, fields.reportData,
                            function(err) {
                                if (!err) {
                                    inspectStoredData(reportData);
                                    res.json(Res);
                                }
                                else {
                                    Res.resultCode = -1
                                    res.json(Res);
                                }
                            });
                    }
                    else {
                        Res.resultCode = -1
                        res.json(Res);
                    }
                });
        });
    },

    put: function(req, res) {
        console.log('put data');
    },

    delete: function(req, res) {

    }
}

exports.collection = collection;
