let wpm = 300;

function changeWPM(amount) {
    wpm = (wpm + amount >= 5) ? wpm + amount : 5;
    $("#current-wpm").text(`${wpm} WPM`);
}

$(document).ready(function() {
    $(document).keydown(function(event) {
        if (event.keyCode === 32) { // Spacebar keyCode is 32
            $("*").attr("reading", true);
        }

        // Change WPM
        if (event.keyCode === 37) { // Left Arrow
            changeWPM(-5);
        }
        if (event.keyCode === 39) { // Right arrow
            changeWPM(5);
        }
    });
    
    $(document).keyup(function(event) {
        if (event.keyCode === 32) { // Spacebar keyCode is 32
            $("*").attr("reading", false);
        }
    });
    

    $('#button-more-wpm').click(function() {
        changeWPM(5);
    });
    $('#button-less-wpm').click(function() {
        changeWPM(-5)
    });
})