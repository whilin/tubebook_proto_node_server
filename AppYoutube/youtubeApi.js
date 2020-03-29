const crawler = require("./crawler.js")

var collection = {
    
    post : function(req, res)
    {
        console.log('post hello');
        
        var body = req.body;
        var channelId = body.channelId;
        
        crawler.findChannel(channelId, function (err) {
            
        });
        
     //  res.send("post hello world");
    },
}

exports.collection = collection;