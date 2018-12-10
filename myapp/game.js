var game = function (gameID) {
    this.white = null;
    this.black = null;
    this.id = gameID;
    this.gameBoard = null;
    this.currentColor = 'white';
    this.gameState = 'waiting';
};

game.prototype.newGameBoard = function (){
    var board = new Array(8);
    for(var x = 0; x < 8; x++){
        board[x] = new Array(8);
        for(var y = 0; y < 8;y++){
            board[x][y] = 'empty';
        }
    }
    board[3][3] = 'white';
    board[3][4] = 'black';
    board[4][3] = 'black';
    board[4][4] = 'white';

    return board;
}

game.prototype.placeChip = function(player, col, row){
    var changes = new Array();

    if(player.color !== this.currentColor || this.gameState !== 'playing'){

        return changes;
    }

    var opponent = (player === this.white)?this.black:this.white;
    //console.log("opponentsscore: "+ opponent.score)
    //console.log("playersscore: "+ player.score)

    var directions = this.isLegal(player.color,col,row);
    
    if(directions.length !== 0){
        
        for(var i = 0; i < directions.length; i++){
            var temp = this.placeInDirection(player.color,col,row, directions[i][0],directions[i][1]);

            for(var x = 0; x < temp.length; x++){
                changes.push(temp[x]);
                player.score += 1;
                opponent.score -= 1;
            }
        }
        


        this.gameBoard[col][row] = player.color;
        player.score +=1;
        //console.log("opponentsscore: "+ opponent.score)
        //console.log("playersscore: "+ player.score)
        this.currentColor = (player.color === 'white')?'black':'white';

    } 
    return changes;
};

game.prototype.placeInDirection = function(color,col,row, xdir,ydir){
    var changes = [];
    col -= -xdir;
    row -= -ydir;

    while(this.getOwner(col,row) !== color){
        changes.push([col,row]);
        this.gameBoard[col][row] = color;
        col+= xdir;
        row+= ydir;
        

    }
    return changes;
    
}

game.prototype.isGameOver = function(color){
    if(this.gameState !== 'playing'){
        //console.log("we arent even playing!");
        return false
    }
    //console.log("checking if gameover");
    for(var x = 0; x < 8; x++){
        for(var y = 0; y < 8; y++){
            if(this.gameBoard[x][y] === 'empty'){
                
                if(this.isLegal(color,x,y).length !== 0){
                    return false;
                }
            }
        }
    }
    
    return true;
}

game.prototype.isLegal = function(color,col,row){

    var directions = [];
    
    if(this.gameBoard[col][row] !== 'empty')
        return directions;

    for(var i = -1; i <= 1; i++){
        for(var j = -1; j <= 1; j++){

            if(i!== 0 || j!== 0){
                if(this.checkDirection(color,col,row,i,j)){
                    //console.log("found direction");
                    directions.push([i,j]);
                }
            }
        }
    }
    return directions;
};


game.prototype.checkDirection = function(color,x,y,xdir,ydir){
    var opposite;
    x += xdir;
    y += ydir;

    if(x < 0 || y < 0 || x > 7 || y > 7)
        return false;

    if(color === 'white'){
        opposite = 'black';
    }else if( color === 'black'){
        opposite = 'white';
    }

    if(this.getOwner(x,y) !== opposite){
        return false;
    }
    while(this.getOwner(x,y) === opposite){
        x+= xdir;
        y+= ydir;
        if(x < 0 || y < 0 || x > 7 || y > 7) 
            return false;
    }
    return this.getOwner(x,y) === color;

}

game.prototype.addPlayer = function(p){
    if(this.white === null){
        this.white = p;
        this.white.score = 2;
        return 'white';
    }else if(this.black === null){
        this.black = p;
        this.black.score = 2;
        return 'black';
    }else{
        return new error("Invalid call to addPlayer, both already added");
    }
}

game.prototype.clearPlayers = function(){
    this.white = null;
    this.black = null;
    console.log("cleared players");
}

game.prototype.hasTwoConnectedPlayers = function(){
    return this.white !== null && this.black !== null;
}

game.prototype.getOwner = function(x,y){

    return this.gameBoard[x][y];
}


module.exports = game;