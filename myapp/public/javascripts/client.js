

var socket = new WebSocket('ws://' + location.host);

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
            $(id).append("<img src ='./images/" + ms.color + ".png'  />");

            for(var i = 0; i < ms.changes.length;i++){
                var temp = ms.changes[i];
    
                var id2 = '#' + String.fromCharCode(temp[1]+65);
                id2 += (temp[0]+1);
                $(id2).empty();
            
                $(id2).append("<img src ='./images/" + ms.color + ".png'  />");
            }
        }      
    }else if(ms.type === 'gamestate'){

        if(ms.state === 'gameover'){

            alert("Game Over!");
        }else if(ms.state === 'gamestarted'){
            alert("another player joined, you can now play!");
        }
    }else if(ms.type === 'color'){
        alert(' color set to ' + ms.color );
        color = ms.color;
    }else{

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