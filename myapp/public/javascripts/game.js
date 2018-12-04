
var boardSize = 8;
var grid = new Array(boardSize);

for(var i = 0 ;i < boardSize;i++){

    grid[i] = new Array(boardSize);

    for(var j = 0; j < boardSize;j++){
        grid[i][j] = false;
    }
}

$(document).ready(function(){
    $(".board-tile").click(function(){
        var col = $(this).attr('id').substring(1);
        
        var row = $(this).parent().attr('id').substring(3);
        if(!grid[col][row]){
            $(this).append("<img src='./images/bitmap.png' />")
            grid[col][row] = true;
        }
    })

})