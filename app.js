var express = require('express');
var app = express();
var http = require('http').Server(app);

// 静的ファイル配置
app.use(express.static(__dirname + '/'));

// ルーティング
app.get('/', function(req, res)
{
    res.sendFile(__dirname + '/index.html');
});

// サーバ起動
var port = process.env.PORT || 3000;
http.listen(port, function()
{
    console.log('listening on port ' + port);
});
