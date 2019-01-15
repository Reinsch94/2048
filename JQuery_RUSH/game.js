var grid;
var score = 0;
var bestScore = 0;
var drift = new Audio("move.wav");

function setup(){
	score = 0;
	$("#best_score").empty().append(bestScore);
    grid = clear();
    addNumber();
	addNumber();
	draw();
}

function clear(){
	return [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
}

function duplicate(grid) {
	var mirror = clear();

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			mirror[i][j] = grid[i][j];
		}
	}
	return mirror;
}

function compare(a, b) {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (a[i][j] != b[i][j])
				return true;
		}
	}
	return false;
}

function flip(grid) {
	for (var i = 0; i < 4; i++)
		grid[i].reverse();

	return grid;
}

function rotate(grid) {
	var newGrid = clear();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			newGrid[i][j] = grid[j][i];
		}
	}
	return newGrid;
}

function GameOver() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grid[i][j] == 0)
				return false;
			if (i !== 3 && grid[i][j] === grid[i + 1][j])
				return false;
			if (j !== 3 && grid[i][j] === grid[i][j + 1])
				return false;	
		}
	}
	return true;
}

function Win() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grid[i][j] == 2048) {
				return true;
			}
		}
	}
	return false;
}

function addNumber() {
	var options = [];
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if ((grid[i][j]) == 0) {
				options.push({
					x: i,
					y: j
				});
			}
		}
	}
	if (options.length > 0) {
		var spot = options[Math.floor(Math.random() * options.length)];
		var r = Math.random(1);
		grid[spot.x][spot.y] = r > 0.9 ? 4 : 2;
	}
}

function draw() {
	$('#board').empty();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grid[i][j] != 0) {
				var divToAppend = "<div class='cell'>"+grid[i][j]+"</div>";
				$("#board").append(divToAppend).show('slow');
				applyBackground($('#board div:last-child'));
			}
			else
				$("#board").append("<div class='cell'></div>");
		}
	}
	$("#score").empty().append(score);
}

function move(row) {
	var arr = row.filter(val => val);
	var missing = 4 - arr.length;
	var zeros = Array(missing).fill(0);
	arr = zeros.concat(arr);
	return arr;
}

function merge(row) {
	for (var i = 3; i >= 1; i--) {
		var a = row[i];
		var b = row[i - 1];
		if (a == b) {
			row[i] = a + b;
			score += row[i];
			if (score > bestScore) {
				bestScore = score;
			}
			row[i-1] = 0;
		}
	}
	return row;
}

function moveAndMerge(row) {
	row = move(row);
	row = merge(row);
	row = move(row);
	return row;
}

function applyBackground(cell) {
	var value = $(cell).html();
	switch (value) {
		case "2":
			$(cell).addClass("case2");
			break;
		case "4":
			$(cell).addClass('case4');
			break;
		case "8":
			$(cell).addClass('case8');
			break;
		case "16":
			$(cell).addClass('case16');
			break;
		case "32":
			$(cell).addClass('case32');
			break;
		case "64":
			$(cell).addClass('case64');
			break;
		case "128":
			$(cell).addClass('case128');
			break;
		case "256":
			$(cell).addClass('case256');
			break;
		case "512":
			$(cell).addClass('case512');
			break;
		case "1024":
			$(cell).addClass('case1024');
			break;
		case "2048":
			$(cell).addClass('case2048');
			break;
		default:
			$(cell).addClass("occupied");
	}
}

function keypress(e) {
	var flipped = false;
	var rotated = false;
	var played = true;
	if (e.keyCode == 39) {
	}
	else if (e.keyCode == 37) {
		grid = flip(grid);
		flipped = true;
	}
	else if (e.keyCode == 40) {
		grid = rotate(grid);
		rotated = true;
	}
	else if (e.keyCode == 38) {
		grid = rotate(grid);
		grid = flip(grid);
		flipped = true;
		rotated = true;
	}
	else {
		played = false;
	}
		
	if (played) {
		var past = duplicate(grid);
		for (var i = 0; i < 4; i++) {
			grid [i] = moveAndMerge(grid[i]);
		}

		var changed = compare(past, grid);
		if (flipped) {
			grid = flip(grid);
		}

		if (rotated) {
			grid = rotate(grid);
			grid = rotate(grid);
			grid = rotate(grid);
		}

		if (changed) {
			addNumber();
			drift.play();
		}
		
		draw();
		var loose = GameOver();
		var win = Win();
		if (loose) {
			swal({
 				title: "ta pairdu!",
  				text: "T 1 merd djaison!",
  				button: "Vou croivez ke tu seré mieu fère!",
			});
		}
		if (win) {
			swal({
 				title: "braveau le vo !",
  				text: "Wallah t bon as gagné!",
  				button: "Vou croivez ke tu seré mieu fère!",
			});
		}
	}
}

$(document).ready(function() {
	setup();
	$(document).keydown(function(e) {
		keypress(e);
	});
});