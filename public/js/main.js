/** Globals **/
var socket = io('http://localhost:3000/');
var Player = null;

$(window).bind('beforeunload',function(){
    /** Save player in cookie when page unloads **/
    if(Player) {
        setCookie("Player.Cached", JSON.stringify(Player), 30);
        socket.emit("Player.Save", Player._id);
    }
});

$(document).ready(function() {
    playAudio("titleTheme");

    if(getCookie("Player.Cached")) {
        $("#continue").removeClass("hidden");
    }

    socket.on('connect', function () {
        console.log("Connected to Game sever.");
    });

    socket.on("Player.Loaded", function(player) {
        console.log("Loading "+player.name);
        console.log(player);
        loadPlayer(player);
        loadGame();
    });

    socket.on("Player.Target.Updated", function(environment) {
        console.log("Loading Target");
        updateEnvironment(environment);
    });

    $("#newGame").on("click", function(e) {
        $("#newPlayerModal").modal("show");
        $("#loadPlayerModal").modal("hide");
    });

    $("#loadGame").on("click", function(e) {
        $("#loadPlayerModal").modal("show");
        $("#newPlayerModal").modal("hide");
    });

    $("#continue").on("click", function(e) {
        var playerJSON = JSON.parse(getCookie("Player.Cached"));
        socket.emit("Player.Load.FromCache", playerJSON);
    });

    $("#loadPlayerForm").on("submit", function(e) {
        e.preventDefault();

        var values = {};
        $.each($('#loadPlayerForm').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        socket.emit("Player.Load", values);
    });

    $("#newPlayerForm").on("submit", function(e) {
        e.preventDefault();

        var values = {};
        $.each($('#newPlayerForm').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        socket.emit("Player.Create", values);
    });

    /** Console Scroll Control **/

    $("#console").change(function() {
        $(this).scrollTop($(this)[0].scrollHeight);
    });


});

populateClassesList();
populateSpeciesList();

function populateClassesList() {
    $.ajax({
        url: "/classes"
    }).done(function(data) {
        if(data.ok) {
            for(var c in data.body) {
                $("#class").append("<option value='"+data.body[c].name+"'>"+data.body[c].name+"</option>");
            }
        } else {
            alert("Error loading Class list.");
        }
    });
}

function populateSpeciesList() {
    $.ajax({
        url: "/species"
    }).done(function(data) {
        if(data.ok) {
            for(var s in data.body) {
                $("#species").append("<option value='"+data.body[s].name+"'>"+data.body[s].name+"</option>");
            }
        } else {
            alert("Error loading Species list.");
        }
    });
}

function loadGame() {
    $("#title").hide();
    $(".gameUI").removeClass("hide");
    $("#loadPlayerModal").modal("hide");
    $("#newPlayerModal").modal("hide");
    playAudio("travelTheme");
    updateLocation();
}

function save() {

}