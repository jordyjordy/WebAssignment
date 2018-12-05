var express = require("express");
var http = require("http");
var websocket = require("ws");
var game = require("./game");
var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));

var gameone = new game(1);
gameone.gameBoard = gameone.newGameBoard();

var server = http.createServer(app);

const wss = new websocket.Server({server});

wss.on("connection", function(ws){

    ws.on("message",function incoming(message){
        var mes = JSON.parse(message);
        //console.log("hi?");
        var result = gameone.placeChip(mes.player,mes.column,mes.row);
        console.log("hi?");
        ws.send(JSON.stringify({result: result,column: mes.column, row:mes.row}));

    })

})
server.listen(port);