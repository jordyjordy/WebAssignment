var game = function (gameID) {
    this.white = null;
    this.black = null;
    this.id = gameID;
    this.gameBoard = null;
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

game.prototype.placeChip = function(string, row, col){

};

game.prototype.isLegal = function(player,row,col){
    
};


module.exports = game;