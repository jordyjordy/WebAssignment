



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

            alert("game over!");
        }
        else if(ms.state === 'gamestarted'){

            $('#waiting').hide();
            $('#started').show();
        }

    }
    else if(ms.type === 'color'){

        color = ms.color;
        //alert(color);
        if(color === 'white'){
            //alert('hi');
            $('#waiting').show();

        }else{

            $('#startedblack').show();

        }

    }else if(ms.type === 'score'){
        handleScoreChange(ms);
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

function gameStarted(id){
    //alert(id);
    $(id).hide();
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
    alert("changing arrows");
    if(ms.color === 'white'){
        
        $('#black-arrow').show();
        $('#white-arrow').hide();

    }else{
        $('#black-arrow').html().hide();
        $('#white-arrow').html().show();
    }
}