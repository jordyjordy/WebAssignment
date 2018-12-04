$(document).ready(function(){
    $(".board-tile").click(function(){
        alert($(this).attr('id'));
        $(this).append("<img src='./images/bitmap.png' />")
    }) 

})