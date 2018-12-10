var express = require("express");
var http = require("http");
var websocket = require("ws");
var cookie = require("cookie-parser");

var game = require("./game");
var stats = require("./statTracker");


var port = process.argv[2];
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cookie());


var gameID = 0
var currentGame = new game(gameID++);
currentGame.gameBoard = currentGame.newGameBoard();
var connectionID = 0;

app.get("/", (req, res) => {

    var cook = parseInt(req.cookies.plays);
    if(cook !== cook)cook = 0;
    else cook++;
    res.cookie("plays",cook,{overwrite: true});

    res.render("splash.ejs", {gamesPlayed: stats.gamesPlayed, gamesInProgress: stats.currentGames, 
        gamesCancelled: stats.gamesCancelled,whiteWins:stats.whiteWins ,blackWins: stats.blackWins,plays:cook});
});

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
        stats.currentGames++;
        stats.gamesPlayed++;
        currentGame.gameState = 'playing';
        console.log("player 2 joined, starting game");
        currentGame.white.send(JSON.stringify({type: 'gamestate', state:'gamestarted'}));
        currentGame = new game(gameID++);
        currentGame.gameBoard = currentGame.newGameBoard();
    }

    con.on("message",function incoming(message){
        var mes = JSON.parse(message);
        var conGame = websockets[con.id];
        
        if(mes.type === 'move'){
            if(conGame.gameState !== 'playing'){
                console.log("not playing yet!");
                return;
            }
            console.log("returning move to " + con.color);
            var result = conGame.placeChip(con,mes.column,mes.row);

           
            if(result.length !== 0){
                conGame.white.send(JSON.stringify({type: 'moveresult',color: con.color, changes: result,column: mes.column, row:mes.row}));
                conGame.black.send(JSON.stringify({type: 'moveresult',color: con.color, changes: result,column: mes.column, row:mes.row}));
                conGame.white.send(JSON.stringify({type: 'score', black:conGame.black.score,white:conGame.white.score}));
                conGame.black.send(JSON.stringify({type: 'score', black:conGame.black.score,white:conGame.white.score}));
            }

            console.log(conGame.currentColor + " can do a move");

            if(conGame.isGameOver(conGame.currentColor)){

                conGame.gameState = 'gameover';

                stats.gamesCompleted++;
                stats.currentGames--;
                var winner;
                if(conGame.black.score > conGame.white.score){

                    winner = 'black';
                    stats.blackWins++

                }else if(conGame.white.score > conGame.black.score){
                    winner = 'white';
                    stats.whiteWins++;
                }
                setTimeout(function() {

                    conGame.white.send(JSON.stringify({type: 'gamestate', state:'gameover',winner: winner }));
                    conGame.black.send(JSON.stringify({type: 'gamestate', state:'gameover',winner: winner}));
                    conGame.white.close();
                    conGame.black.close();

                }, 500);
            }
        }

    })

    con.on("close", function closing(code){
        
        if (code == "1001") {
            let game = websockets[con.id];
            if(game.gameState !== 'gameover'){

                stats.currentGames --;
                stats.gamesCancelled += 1;

                game.gameState = 'cancelled';

                try {
                    game.white.send(JSON.stringify({type: 'gamestate',state: 'quit' }));
                    game.white.close();
                    game.white = null;
                }
                catch(e){
                    console.log("Player A closing: "+ e);
                }

                try {
                    game.black.send(JSON.stringify({type: 'gamestate',state: 'quit' }));
                    game.black.close(); 
                    game.black = null;
                }
                catch(e){
                    console.log("Player B closing: " + e);
                }      
            }

        }

    })

})
server.listen(port);