



var socket = new WebSocket('ws://' + location.host);

/*var messageTypes = {
    game_shift: "GAMESHIFT",
    gameover: "GAMEOVER" // this message is sent when the game is 
}*/
socket.onmessage = function(data){

    var ms = JSON.parse(data.data);
    if(ms.type === 'moveresult'){

        handleMovement(ms);
        if(ms.changes.length !== 0){
            handleTurnArrow(ms);
        }
    
    }else if(ms.type === 'gamestate'){

        if(ms.state === 'gameover'){

            $("#popup").empty();
            $("#popup").load("./popups/started.html");
            $('#victor').append(ms.winner);
            $("#popup").show();
        }
        else if(ms.state === 'gamestarted'){
            
            $("#popup").empty();
            $("#popup").load("./popups/started.html");
            $("#popup").show();

        }else if(ms.state ==='quit'){
            
            $("#popup").empty();
            $("#popup").load("./popups/quit.html");
            $("#popup").show();
        }

    }
    else if(ms.type === 'color'){

        color = ms.color;
        
        if(color === 'white'){
            
            $("#popup").load("./popups/waiting.html")

        }else{
            $("#popup").load("./popups/startedblack.html")

        }
        $("#popup").show();

    }else if(ms.type === 'score'){
        handleScoreChange(ms);
    }
    
}

socket.onclose = function(){
    
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

function gameStarted(id){
    $("#popup").empty()
    $("#popup").hide();
}

function handleMovement(ms){
            
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
}

function handleScoreChange(ms){

    $('#blackscore').text(ms.black);
    $('#whitescore').text(ms.white);
}

function handleTurnArrow(ms){
    if(ms.color === 'white'){
        $('#right-arrow').css('opacity', '1');
        $('#left-arrow').css('opacity', '0');
    }else{
        $('#right-arrow').css('opacity', '0');
        $('#left-arrow').css('opacity', '1');
    }
}

function hideWarning(){
    $('#mediawarning').hide();
}