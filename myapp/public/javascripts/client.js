

var socket = new WebSocket('ws://localhost:3000');

/*var messageTypes = {
    game_shift: "GAMESHIFT",
    gameover: "GAMEOVER" // this message is sent when the game is 
}*/
socket.onmessage = function(data){

    var ms = JSON.parse(data.data);
    if(ms.type === 'moveresult'){

        if(ms.changes.length !== 0){
            var id =  '#' + String.fromCharCode(ms.row+65);
            id += (ms.column+1);
            $(id).append("<img src ='./images/" + color + ".png'  />");

            for(var i = 0; i < ms.changes.length;i++){
                var temp = ms.changes[i];
    
                var id2 = '#' + String.fromCharCode(temp[1]+65);
                id2 += (temp[0]+1);
                $(id2).empty();
            
                $(id2).append("<img src ='./images/" + color + ".png'  />");
            }

            if(color === 'white')
                color = 'black';
            else
                color = 'white';
        }      
    }else if(ms.type === 'gamestate'){

        if(ms.state === 'gameover'){

            alert("Game Over!");
        }
    }else if(ms.type === 'color'){
        var color = ms.color;
    }
}
var boardSize = 8;
var color;
$(document).ready(function(){

    $(".board-tile").click(function(){
        var col = $(this).attr('id').substring(1)-1;
        var row =  $(this).attr('id').charCodeAt(0)-65;

        socket.send(JSON.stringify({type: 'move', player : color, column : col, row: row} ));
    })

})