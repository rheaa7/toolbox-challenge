"use strict";


$(document).ready(function() {
    
    //instructions for how to play the game
    $('#instructions').popover();
    
    //when start button is clicked
    $('#start-game').click(function() {
        startGame();
        $('#start-game').css('display', 'none');
        
    });
    
    //when restart button is clicked
    $('#restart').click(function() {
        startGame();
        $('#overlay').css('visibility', 'hidden');
        $('#instructions').fadeIn(100);
    });
    
    
}); //DOM


//start game set up
function startGame() {
    
    //clear gameboard from previous games
    $('#memory_board').empty();
    
    $('#elapsed-seconds').text('Elapsed time: 0 seconds');
    $('#memory_board').css('opacity', '1');
    $('#statistics').css('opacity', '1');
    $('#gametitle').css('opacity', '1');
    
    //puts tiles into array
    var tilesArray = [];
    
    for (var i = 1; i <=32; i++) {
        tilesArray.push({
            tileNum: i,
            src: 'img/tile' + i + '.jpg',
            matched: false
        });
    }
    
    //shuffle all tiles and pick 8 random tiles
    var shuffleTiles = _.shuffle(tilesArray);
    var selectedTiles = shuffleTiles.slice(0, 8);
    
    //make duplicates of those 8 tiles, total 16
    var tilePairs = [];
    _.forEach(selectedTiles, function(tile) {
        tilePairs.push(_.clone(tile));
        tilePairs.push(_.clone(tile));
    });
    
    //shuffle the 8 pairs of tiles
    tilePairs = _.shuffle(tilePairs);
    
    var gameBoard = $('#memory_board');
    var row = $(document.createElement('div'));
    var newTile;
    
    //insert rows
    _.forEach(tilePairs, function(tile, index) {
        if (index > 0 && !(index % 4)) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }
        newTile = $(document.createElement('img'));
        
        newTile.attr('src', 'img/tile-back.png');
        newTile.attr('alt', 'image of tile' + tile.tileNum);
        newTile.attr('width', '150px');
        newTile.attr('class', 'img-thumbnail');
        
        //use the .data() method to associate extra data with HTML elements
        newTile.data('tile', tile);
        
        row.append(newTile);
    });
    
    gameBoard.append(row);
    
    //set number of matches, number of failed attemps and remaining pairs to 0
    var numMatches = 0;
    var numFailed = 0;
    var remainingPairs = 8;
    
    $('#numMatches').text("Matches found: " + numMatches);
    $('#numFailed').text("Matches missed: "+ numFailed);
    $('#remainingPairs').text("Remaning matches: " + remainingPairs);
    
    //setting the timer
    var elapsedSeconds;
    var startTime = _.now();
    var timer = window.setInterval(function() {
        elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
        $('#elapsed-seconds').text("Elapsed time: " + elapsedSeconds + ' seconds');
        
        
    }, 1000);
    

    var firstImage;
    var firstTile;
    
    //when an img in game-board is clicked
    $('#memory_board img').click(function() {
        var image = $(this);
        var tile = image.data('tile');
        
        if(!tile.matched && !_.isEqual(image, firstImage)) {
            flipTheTile(image, tile);
            
            //if this is not the first tile being clicked
            if(!firstTile) {
                firstImage = image;
                firstTile = tile;
            } else {
                //if tiles match
                if(tile.tileNum === firstTile.tileNum) {
                    tile.matched = true;
                    firstTile.matched = true;
                    firstImage = undefined;
                    firstTile = undefined;
                    numMatches++;
                    remainingPairs--;
                    $('#numMatches').text("Matches found: " + numMatches);
                    $('#remainingPairs').text("Remaning matches: " + remainingPairs);
                    
                } else { //tiles didn't match
                    window.setTimeout(function() {
                        flipTheTile(image, tile);
                        flipTheTile(firstImage, firstTile);
                        firstTile = undefined;
                        image = undefined;
                        numFailed++;
                        $('#numFailed').text("Matches missed: "+ numFailed);
                    }, 400 );
                    
                }
                
                //if all matches are found, player wins and timer stops.
                if (remainingPairs === 0 || numMatches === 8) {
                    $('#memory_board').css('opacity', '0.4');
                    $('#statistics').css('opacity', '0.4');
                    $('#gametitle').css('opacity', '0.4');
                    $('#restart').fadeIn(100);
                    $('#start-game').fadeOut(100);
                    $('#instructions').fadeOut(100);
                    
                    window.clearInterval(timer);
                    overlay();
                    
                }
            }
            
        }
        
    }); //onclick tile
    
} //startGame



//flips the tile
function flipTheTile(image, tile) {
    if (!tile.flipped) {
        image.attr('src', tile.src);
    } else {
        image.attr('src', 'img/tile-back.png');
    }
    tile.flipped = !tile.flipped;
    
}

//win pop-up
function overlay() {
    var el = document.getElementById("overlay");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

