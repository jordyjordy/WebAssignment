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

setInterval(function() {
    for(let i in websockets){
        if(websockets.hasOwnProperty(i)){
            let game = websockets[i];

            //if the game is over or cancelled we will remove it from the array/list.
            if(game.gameState === 'gameover' || game.gameState === 'cancelled'){
                console.log("\tDeleting element "+i);
                delete websockets[i];
            }
        }
    }
}, 50000)


wss.on("connection", function(ws){
    let con = ws;
    con.id = connectionID++;
    con.color = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    con.send(JSON.stringify({type: 'color', color: con.color }));


    //after doing currentgame.addplayer we can check if we have two connected players.
    //if that is the case we have to create a new game and increase some stats.
    if(currentGame.hasTwoConnectedPlayers()){

        stats.currentGames++;
        stats.gamesPlayed++;

        currentGame.gameState = 'playing';

        currentGame.white.send(JSON.stringify({type: 'gamestate', state:'gamestarted'}));

        currentGame = new game(gameID++);
        currentGame.gameBoard = currentGame.newGameBoard();
    }

    //what we should do if the client socket sends a message.
    con.on("message",function incoming(message){

        var mes = JSON.parse(message);
        var conGame = websockets[con.id];
        
        //really the only message that the client will ever send, but just in case.
        if(mes.type === 'move'){

            if(conGame.gameState !== 'playing'){
                
                return;
            }
          
            var result = conGame.placeChip(con,mes.column,mes.row);

           //if the result is not 0 we know it is a valid move, otherwise we dont even have to bother
           //to return anything to the client,
            if(result.length !== 0){
                //send the result to the players: tells the clients which color just made a move,
                // which tiles change color and which tile gets a new token/chip.
                conGame.white.send(JSON.stringify({type: 'moveresult',color: con.color, changes: result,column: mes.column, row:mes.row}));
                conGame.black.send(JSON.stringify({type: 'moveresult',color: con.color, changes: result,column: mes.column, row:mes.row}));

                //update the score on the client for both players. Could have been in the same send
                //but otherwise it wouldve gotten quite big, any downsides? idk
                conGame.white.send(JSON.stringify({type: 'score', black:conGame.black.score,white:conGame.white.score}));
                conGame.black.send(JSON.stringify({type: 'score', black:conGame.black.score,white:conGame.white.score}));
            

            //we check if after the last valid move was made the opponent is able to make any moves.
            //if not we end the game.
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
        }

    })

    //what we should do if one of the clients decide to disconnect
    con.on("close", function closing(code){
        console.log("HELLO");
        //make sure the client closed? this is from the github examples
        if (code == "1001") {
            let game = websockets[con.id];
            console.log('closing game');

            if(game.gameState === 'waiting'){
                console.log("person was waiting");
                currentGame.clearPlayers();
            }
            //we only want to take some action if the game is not over yet.
            //otherwise it's logical that players will leave.
           else if(game.gameState !== 'gameover'){

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