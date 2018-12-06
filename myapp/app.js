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
    let player = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    con.send(JSON.stringify({type: 'color', color: player }));

    if(currentGame.hasTwoConnectedPlayers()){
        currentGame = new game(gameID++);
    }






    con.on("message",function incoming(message){

        var mes = JSON.parse(message);
        var conGame = websockets[con.id];
        
        if(mes.type === 'move'){

            var result = conGame.placeChip(mes.player,mes.column,mes.row);
            con.send(JSON.stringify({type: 'moveresult', changes: result,column: mes.column, row:mes.row}));

            var opponent;

            if(mes.player === 'white'){

                opponent = 'black';

            }
            else{

                opponent = 'white';

            }

            if(conGame.isGameOver(opponent)){
                
                setTimeout(function() {
                    con.send(JSON.stringify({type: 'gamestate', state:'gameover'}));
                }, 500);
            }
        }

    })

})
server.listen(port);