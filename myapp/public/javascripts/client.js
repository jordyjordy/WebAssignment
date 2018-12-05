

var socket = new WebSocket('ws://localhost:3000');

socket.onmessage = function(data){

    var ms = JSON.parse(data.data);
    if(ms.type === 'moveresult'){

        if(ms.res == true){

            var id =  '#' + String.fromCharCode(ms.row+65);
            id += (ms.column+1);

            $(id).append("<img src ='./images/" + color + ".png'  />");

            if(color === 'white')
                color = 'black';
            else
                color = 'white';
        }      
    }
}
var boardSize = 8;
var color = 'white';

$(document).ready(function(){

    $(".board-tile").click(function(){
        var col = $(this).attr('id').substring(1)-1;
        var row =  $(this).attr('id').charCodeAt(0)-65;

        socket.send(JSON.stringify({type: 'move', player : color, column : col, row: row} ));
    })

})