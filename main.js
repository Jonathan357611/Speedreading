let wpm = 300; // WPM variable
let interval = 60000 / wpm; // Calculate interval in ms
let language = "en"; // Set language
let is_book_loading = true;
let words = [];
let current_word = 0;
let spacebar_pressed = false;
let current_book_id = -1; // Hold current book to not load the same twice in a row
let current_theme = "dark"; // Set current theme
let screen_mode = "landscape"; // Current screen mode, will be calculated later

var intervalId; // Store interval function here

let valid_languages = [
    {
        "code": "en",
        "name": "english",
        "native": "english"
    },
    {
        "code": "de",
        "name": "german",
        "native": "deutsch"
    },
    {
        "code": "fr",
        "name": "french",
        "native": "français"
    },
    {
        "code": "es",
        "name": "spanish",
        "native": "espagnol"
    },
    {
        "code": "it",
        "name": "italian",
        "native": "italiano"
    },
    {
        "code": "pt",
        "name": "portuguese",
        "native": "português"
    }
];

// Function to add an ellipsis after n chars to a string
function addEllipsis(str, maxLength) {
    if (str.length > maxLength) {
        return str.slice(0, maxLength) + "...";
    } else {
        return str;
    }
}

// Load random book based on language
function loadRandomBook(language) {
    // Indicate that a book is loading
    is_book_loading = true;
    $("#status-indicator").text("(loading book...)");
    $("#current-word").text("...");
    $("#book-title").text("...");
    $("#book-author").text("...");

    $.getJSON(window.location.href + "books.json", function(data) { // Get list of books
        let books = data["languages"][language]; // All books in specified language

        // Ensure not loading the same book twice in a row
        let first_iter = true;
        let book_id = -1;
        while (book_id == current_book_id || first_iter) {
            first_iter = false;
            book = books[Math.floor(Math.random() * (books.length))]; // Select random book
            book_id = book["id"];
        }
        current_book_id = book_id;

        $("#book-title").text(addEllipsis(book["title"], 30)); // Show book title
        $("#book-author").text(addEllipsis(book["author"], 30)); // Show book author
    
        // Load words into array
        $.get(window.location.href + "books/" + language + "/" + book["id"] + ".txt", function(data) { // Get text of the random book
            words = data.split((/\s+|\n/)); // All words into array, split by " " and newlines
            current_word = Math.floor(Math.random() * (words.length));
            $("#current-word").text(words[current_word]); // Show word

            // Indicate that a book has been loaded
            is_book_loading = false;

            if (screen_mode == "landscape") {
                $("#status-indicator").text("hold [space] to read");
            } else {
                $("#status-indicator").text("hold screen to read");
            }
        })
    });
}

// Function to change wpm, sets interval in ms
function changeWPM(amount) {
    wpm = (wpm + amount >= 5) ? wpm + amount : 5;
    $("#current-wpm").text(`${wpm} WPM`);
    interval = 60000 / wpm;
}

// Get next word from words array
function displayNextWord() {
    if (current_word < words.length) {
        $("#current-word").text(words[current_word]);
        current_word++;
    } else {
        current_word = 0;
    }
}

// Replace interval function
function updateInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(displayNextWord, interval);
}

$(document).ready(function() {
    $("#menu").hide();
    loadRandomBook(language); // Load random book initially

    // Define portrait mode media quer
    var portraitQuery = window.matchMedia("(orientation: portrait)");

    // Function to handle orientation change
    function handleOrientationChange(mq) {
        if (mq.matches) { // If portrait mode
            screen_mode = "portrait";
        } else { // If landscape mode
            screen_mode = "landscape";
        }
    }

    // Initial screen direction check
    handleOrientationChange(portraitQuery);

    // Add event listener to screen dimension changes
    portraitQuery.addEventListener("change", function(e) {
        handleOrientationChange(e);
    });

    $(document).keydown(function(event) {
        if (event.keyCode === 32 && !is_book_loading && !spacebar_pressed) { // When spacebar pressed
            spacebar_pressed = true;
            $("*").attr("reading", true); // Activate reading mode
            displayNextWord(); // Display the first word immediately
            updateInterval(); // Replace interval function
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
        if (event.keyCode === 32) { // When spacebar released
            spacebar_pressed = false;
            $("*").attr("reading", false); // Deactivate reading mode
            clearInterval(intervalId); // Clear interval function
        }
    });


    // Function to handle touchstart event
    function handleTouchstart(event) {
        var simulatedKeydownEvent = new $.Event("keydown", { keyCode: 32 });
        $(document).trigger(simulatedKeydownEvent);
    }

    // Function to handle touchend event
    function handleTouchend(event) {
        var simulatedKeyupEvent = new $.Event("keyup", { keyCode: 32 });
        $(document).trigger(simulatedKeyupEvent);
    }

    // Attach touch event listeners directly to the div
    $('#center-div').on('touchstart', handleTouchstart);
    $('#center-div').on('touchend touchcancel', handleTouchend);
    
    // Manual change wpm buttons
    $("#button-more-wpm").click(function() {
        changeWPM(5);
    });
    $("#button-less-wpm").click(function() {
        changeWPM(-5)
    });

    // Load new book
    $("#button-new-book").click(function() {
        loadRandomBook(language);
    })

    $("#button-change-language").click(function() {
        // Populate menu
        $("#menu-options").empty();
        for (let i=0; i<valid_languages.length; i++) {
            let language = valid_languages[i];
            $("#menu-options").append(`<span class="menu-option" value="${language["code"]}">${language["name"]} <span style="opacity: 0.4">(${language["native"]})</span></span>`)
        }
        $("#menu").show();
    })
    $("#menu-close-button").click(function() {
        $("#menu").hide();
    })

    $(document).on("click", ".menu-option", function() {
        language = $(this).attr("value");
        loadRandomBook(language);
        $("#menu").hide();
    });


    $("#button-change-theme").click(function() {
        if (current_theme == "dark") {
            $(":root").css("--color-background", "white");
            $(":root").css("--color-foreground", "black");
            current_theme = "light";
        } else {
            $(":root").css("--color-background", "black");
            $(":root").css("--color-foreground", "white");
            current_theme = "dark";
        }
    })

    $("#button-portfolio").click(function() {
        window.open("https://github.com/Jonathan357611/Speedreading", "_blank");
    })
})