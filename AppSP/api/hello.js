var collection = {
    
    post : function(req, res)
    {
        console.log('post hello');
        res.send("post hello world");

    },
    
    get : function(req, res)
    {
        console.log('get hello');
        res.send("get hello world");
    },


    put : function(req, res)
    {
        console.log('put hello');
        res.send("put hello world");
    }
}

exports.collection = collection;