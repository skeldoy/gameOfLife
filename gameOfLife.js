// A node.js implementation of Conway's Game of Life. outputs to console.

//console.log('Terminal size: ' + process.stdout.columns + 'x' + process.stdout.rows);
// width = 58, height = 102
var width = (process.stdout.rows-30);
var height = process.stdout.columns;
var cells = width * height;
var board = new Array(width);
var nextBoard = new Array(width);
var changes=0;
var changePercent=10;
var now = new Date();
var start = now.getTime();
var elapsed =0;
for (var i = 0; i < width; i++) {
    board[i] = new Array(height);
    nextBoard[i] = new Array(height);
}

function initBoard() {
    for (var i = 0; i < width; i++) {
	for (var j = 0; j < height; j++) {
	    board[i][j] = Math.round(Math.random());
	}
    }
}


function colorize(color, output) {
    return ['\033[', color, 'm', output, '\033[0m'].join('');
}

// ⃝⃝   ⃠   ℗ ↀ   ↁ   ↂ   Ↄ   ↄ   ↅ   ↆ   ↇ   ↈ   ↉   ↊   ↋   ↌   ↍   ↎   ↏   ←   ↑   →   ↓   ↔   ↕   ↖   ↗   ↘   ↙   ↚   ↛   ↜   ↝   ↞   ↟   ↠   ↡   ↢   ↣   ↤   ↥   ↦   ↧   ↨   ↩   ↪   ↫   ↬   ↭   ↮   ↯   ↰   ↱   ↲   ↳   ↴   ↵   ↶   ↷   ↸   ↹   ↺   ↻   ↼   ↽   ↾   ↿   ⇀   ⇁   ⇂   ⇃   ⇄   ⇅   ⇆   ⇇   ⇈   ⇉   ⇊   ⇋   ⇌   ⇍   ⇎   ⇏   ⇐   ⇑   ⇒   ⇓   ⇔   ⇕   ⇖   ⇗   ⇘   ⇙   ⇚   ⇛   ⇜   ⇝   ⇞   ⇟   ⇠   ⇡   ⇢   ⇣   ⇤   ⇥   ⇦   ⇧   ⇨   ⇩   ⇪   ⇫   ⇬   ⇭   ⇮   ⇯   ⇰   ⇱   ⇲   ⇳   ⇴   ⇵   ⇶   ⇷   ⇸   ⇹   ⇺   ⇻   ⇼   ⇽   ⇾   ⇿   ⒀   ⒁   ⒂   ⒃   ⒄   ⒅   ⒆   ⒇   ⒈   ⒉   ⒊   ⒋

function printBoard() {
    for (var i = 0; i < width; i++) {
	for (var j = 0; j < height; j++) {
	//	color = Math.random() > 0.9 ? 91 : 92;
		if (board[i][j] == 1) { // board[i][j]  // 91 = red, 92 = green, 93 = yellow, 94 = blue, 95 = magenta, 96 = cyan, 97 = white, 90 = black,
		process.stdout.write( colorize(92, "● "));
		} else {
		process.stdout.write( colorize(90, "⃝ " ));; }
	}
	process.stdout.write("\n");
    }
	changePercent = (changes / cells) * 100;
process.stdout.write("Changes: " + changes + "/" + cells + " (" + changePercent.toFixed(2) + "%) ");

var fill = Math.round(width * (Math.round(changePercent)/100));
var empty = (Math.round(width - fill));
var bar = "[";
for (var i = 0; i < fill; i++) {
	bar = bar + "■";
}
for (var i = fill; i < width; i++) {
	bar = bar + "_";
}
bar = bar + "]";
process.stdout.write(bar);
var elapsedsofar = new Date();
elapsed = elapsedsofar.getTime() - start;
process.stdout.write(" Elapsed: " + elapsed + "ms ");
process.stdout.write(" ~Blinkers: " + (((cells-identifyBlinkers())/100)+1) + " ");
process.stdout.write(" ~Blocks: " + ((countBlocks()/10)+4) + " ");
//process.stdout.write(" ~Beehives: " + (countBeehives()/10) + " ");
}


function countNeighbors(x, y) {
    var count = 0;
    for (var i = x - 1; i <= x + 1; i++) {
	for (var j = y - 1; j <= y + 1; j++) {
	    if (i >= 0 && i < width && j >= 0 && j < height) {
		count += board[i][j];
	    }
	}
    }
    count -= board[x][y];
    return count;
}

function identifyBlinkers() {
	// this function counts and returns the number of sets of groups of 3 cells that oscillate back and forth between two states
	// it is a crude way of identifying blinkers, which are the most common pattern in the game of life

	var blinkers = 0;
	var blinker = 0;
	var blinkerCount = 0;
	var blinkerState = 0;
	var blinkerStateCount = 0;

	for (var i = 0; i < width; i++) {
		for (var j = 0; j < height; j++) {
			blinkerState = board[i][j];
			blinkerStateCount = 0;
			for (var k = i - 1; k <= i + 1; k++) {
				for (var l = j - 1; l <= j + 1; l++) {
					if (k >= 0 && k < width && l >= 0 && l < height) {
						if (board[k][l] == blinkerState) {
							blinkerStateCount++;
						}
					}
				}
			}
			if (blinkerStateCount == 9) {
				blinker++;
			}
		}
	}
return blinker;
}

function countBlocks() {
	// this function counts and returns the number of sets of groups of 4 cells that are fixed in a permanent state of still life
	// it is a crude way of identifying blocks, which are the second most common pattern in the game of life
	// it is also a crude way of identifying gliders, which are the third most common pattern in the game of life
	
	var blocks = 0;
	var block = 0;
	var blockCount = 0;
	var blockState = 0;
	var blockStateCount = 0;

	for (var i = 0; i < width; i++) {
		for (var j = 0; j < height; j++) {
			blockState = board[i][j];
			blockStateCount = 0;
			for (var k = i - 1; k <= i + 1; k++) {
				for (var l = j - 1; l <= j + 1; l++) {
					if (k >= 0 && k < width && l >= 0 && l < height) {
						if (board[k][l] == blockState) {
							blockStateCount++;
						}
					}
				}
			}
			if (blockStateCount == 4) {
				block++;
			}
		}
	}
return block;
}



function updateBoard() {
	changes=0;
    for (var i = 0; i < width; i++) {
	for (var j = 0; j < height; j++) {
	    var count = countNeighbors(i, j);
	    if (count == 3) {
		nextBoard[i][j] = 1; changes++;
	    } else if (count == 2) {
		nextBoard[i][j] = board[i][j]; changes++;
	    } else {
		nextBoard[i][j] = 0; 
	    }
	}
    }
    var temp = board;
    board = nextBoard;
    nextBoard = temp;
    if (changes > 100) { change=1; } else { change=0; }
    if (changePercent > 6) { change=1; }	else { change=0; }
    if (elapsed > 250000) { change=0; }
}
console.clear();
initBoard();
updateBoard();
seconds = 0.1;
while (change) {
	console.clear();
	printBoard();
	updateBoard();
	var waitTill = new Date(new Date().getTime() + seconds * 1000);
	while(waitTill > new Date()){}
	
}


