var express = require("express");
var http = require("http");
var websocket = require("ws");
var game = require("./game");
var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));


var gameID = 0
var currentGame = new game(gameID++);
currentGame.gameBoard = currentGame.newGameBoard();
var connectionID = 0;
var server = http.createServer(app);

const wss = new websocket.Server({server});

var websockets = {};

wss.on("connection", function(ws){
    let con = ws;
    con.id = connectionID++;
    con.color = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    con.send(JSON.stringify({type: 'color', color: con.color }));

    if(currentGame.hasTwoConnectedPlayers()){
        currentGame.gameState = 'playing';
        console.log("player 2 joined, starting game");
        currentGame.white.send(JSON.stringify({type: 'gamestate', state:'gamestarted'}));
        currentGame = new game(gameID++);
    }






    con.on("message",function incoming(message){
        var mes = JSON.parse(message);
        var conGame = websockets[con.id];
        
        if(mes.type === 'move'){
            console.log("returning move to " + con.color);
            var result = conGame.placeChip(con,mes.column,mes.row);

            conGame.white.send(JSON.stringify({type: 'moveresult',color: con.color, changes: result,column: mes.column, row:mes.row}));
            conGame.black.send(JSON.stringify({type: 'moveresult',color: con.color, changes: result,column: mes.column, row:mes.row}));

            console.log(conGame.currentPlayer + " can do a move");

            if(result.length !== 0 && conGame.isGameOver(conGame.currentPlayer)){
                
                setTimeout(function() {

                    conGame.white.send(JSON.stringify({type: 'gamestate', state:'gameover'}));
                    conGame.black.send(JSON.stringify({type: 'gamestate', state:'gameover'}));
                    
                }, 500);
            }
        }

    })

})
server.listen(port);