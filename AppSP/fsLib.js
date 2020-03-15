const fs = require("fs");

function moveFile(oldpath, newpath) {
  
    fs.rename(oldpath, newpath, function(err) {
        if (err)
            console.error(err);
        else
            console.log('moveFile completed! '+oldpath+'>'+newpath);
    });
}

function saveBinaryDataToFile(filepath, imageData) {

    fs.writeFile(filepath, imageData, 'binary', function(err) {
        if (err)
            console.error(err);
        else
            console.log('saveBinaryDataToFile completed! '+filepath);
    });
}

exports.moveFile = moveFile;
exports.saveBinaryDataToFile = saveBinaryDataToFile;