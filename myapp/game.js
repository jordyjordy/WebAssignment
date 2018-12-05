var game = function (gameID) {
    this.white = null;
    this.black = null;
    this.id = gameID;
    this.gameBoard = null;
    //this.state = blah;
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

game.prototype.placeChip = function(string, col, row){
    if(this.isLegal(string,col,row)){
        this.gameBoard[col][row] = string;
        return true;
    } 
    return false;
};

game.prototype.isLegal = function(player,col,row){

    var legal = false;

    for(var i = -1; i <= 1; i++){
        for(var j = -1; j <= 1; j++){

            if(i!== 0 || j!== 0){
                if(this.checkDirection(player,col,row,i,j)){
                    legal = true;
                }
            }
        }
    }
    return legal;
};

game.prototype.checkDirection = function(player,x,y,xdir,ydir){
    var opposite;
    x -= -xdir;
    y -= -ydir;

    if( player === 'white'){
        opposite = 'black';
    }else{
        opposite = 'white';
    }
    if(this.getOwner(x,y) !== opposite){
        return false;
    }
    while(this.getOwner(x,y) === opposite){
        console.log()
        x+= xdir;
        y+= ydir;
    }
    return this.getOwner(x,y) === player;

}

game.prototype.getOwner = function(x,y){
    return this.gameBoard[x][y];
}


module.exports = game;