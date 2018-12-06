var game = function (gameID) {
    this.white = null;
    this.black = null;
    this.id = gameID;
    this.gameBoard = null;
    var currentPlayer = this.white;
};


var currentPlayer = this.white


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

game.prototype.placeChip = function(color, col, row){

    var directions = this.isLegal(color,col,row);
    var changes = new Array();
    if(directions.length !== 0){

        for(var i = 0; i < directions.length; i++){
            var temp = this.placeInDirection(color,col,row, directions[i][0],directions[i][1]);

            for(var x = 0; x < temp.length; x++){
                changes.push(temp[x]);
            }
        }
        console.log("valid move");
        this.gameBoard[col][row] = color;

        return changes;
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
    for(var x = 0; x < 8; x++){
        for(var y = 0; y < 8; y++){
            if(this.gameBoard[x][y] === 'empty'){
                if(this.isLegal(color,x,y).length !== 0){
                    return false;
                }
            }
        }
    }
    console.log("found no valid moves");
    return true;
}

game.prototype.isLegal = function(player,col,row){

    var directions = [];
    
    if(this.gameBoard[col][row] !== 'empty')
        return directions;

    for(var i = -1; i <= 1; i++){
        for(var j = -1; j <= 1; j++){

            if(i!== 0 || j!== 0){
                if(this.checkDirection(player,col,row,i,j)){

                    directions.push([i,j]);
                }
            }
        }
    }
    return directions;
};


game.prototype.checkDirection = function(player,x,y,xdir,ydir){
    var opposite;
    x += xdir;
    y += ydir;
    if(x < 0 || y < 0 || x > 7 || y > 7)
        return false;
    if( player === 'white'){
        opposite = 'black';
    }else{
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
    return this.getOwner(x,y) === player;

}
game.prototype.addPlayer = function(p){
    if(this.white === null){
        this.white = p;
        return 'white';
    }else if(this.black === null){
        this.black = p;
        return 'black';
    }else{
        return new error("Invalid call to addPlayer, both already added");
    }
}

game.prototype.hasTwoConnectedPlayers = function(){
    return this.white !== null && this.black !== null;
}

game.prototype.getOwner = function(x,y){

    return this.gameBoard[x][y];
}


module.exports = game;