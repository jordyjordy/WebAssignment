

var socket = new WebSocket('ws://localhost:3000');
socket.onmessage = function(event){
    //    alert("hello");
    if(ms.result){
        alert("can place in "+ ms.column + "," + ms.row);
    }
}
var boardSize = 8;
var color = 'white';

$(document).ready(function(){
    $(".board-tile").click(function(){
        var col = $(this).attr('id').substring(1)-1;
        
        var row = $(this).parent().attr('id').substring(3)-1;
        alert(color + col + row);
        socket.send(JSON.stringify({ player : color, column : col, row: row} ));
    })

})