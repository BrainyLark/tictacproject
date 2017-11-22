var origBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';


const coralColor = "#ff7f50";
const blueColor = "#2E9AFE";

const PLUS_INFINITY = 10000;
const NEUTRAL = 30;
const NOT_ENOUGH = 10;
const BADLY = 0;
const MINUS_INFINITY = -10000;

initTable();
const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(900).keys());

    for(var i = 0; i < cells.length; i++) {
        cells[i].innerText = ''; //i
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener("click", turnClick, false);
    }
}

function initTable() {
    var table = document.getElementById("mainTable");
    for(var i = 0; i < 30; i++) {
        var row = table.insertRow(i);
        for(var j = 0; j < 30; j++) {
            var cell = row.insertCell(j);
            cell.id = i * 29 + i + j;
            cell.className = "cell";
        }
    }
}

function turnClick(square) {
    if(typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, humanPlayer);
        if(!checkTie()) {
            turn(bestSpot(square.target.id), aiPlayer);
        }
    }

}
function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;

    let gameWon = checkWin(origBoard, parseInt(squareId), player);
    //alert("Winning combo: " + JSON.stringify(gameWon.combos) + "\n" + " player : " + gameWon.player)
    if(gameWon) gameOver(gameWon);
}

function checkRightDiagonal(board, clicked, player) {
    var rightDiagonal = 1;
    var tempClicked = clicked;
    var combos = [tempClicked];
    while(board[tempClicked - 29]) {
        if(board[tempClicked - 29] == player) {
            rightDiagonal ++;
            tempClicked -= 29;
            combos = combos.concat(tempClicked);
        }
        else break;
    }
    tempClicked = clicked;
    while(board[tempClicked + 29]) {
        if(board[tempClicked + 29] == player) {
            rightDiagonal ++;
            tempClicked += 29;
            combos = combos.concat(tempClicked);
        }
        else break;
    }
    return (rightDiagonal >= 5) ? {combos: combos, count: rightDiagonal} : {combos: null, count: rightDiagonal};
}

function checkLeftDiagonal(board, clicked, player) {
    var leftDiagonal = 1;
    var tempClicked = clicked;
    var combos = [tempClicked];
    while(board[tempClicked - 31]) {
        if(board[tempClicked - 31] == player) {
            leftDiagonal ++;
            tempClicked -= 31;
            combos = combos.concat(tempClicked);
        }
        else break;
    }
    tempClicked = clicked;
    while(board[tempClicked + 31]) {
        if(board[tempClicked + 31] == player) {
            leftDiagonal ++;
            tempClicked += 31;
            combos = combos.concat(tempClicked);
        }
        else break;
    }
    return (leftDiagonal >= 5) ? {combos: combos, count: leftDiagonal} : {combos: null, count: leftDiagonal};
}

function checkHorizontal(board, clicked, player) {
    var horizontal = 1;
    var tempClicked = clicked;
    var combos = [tempClicked];
    while(board[tempClicked - 1]) {
        if(board[tempClicked - 1] == player && !isFirstCell(board[tempClicked - 1]) && !isLastCell(board[tempClicked - 1])) {
            horizontal ++;
            tempClicked --;
            combos = combos.concat(tempClicked);
        }
        else break;
    }
    tempClicked = clicked;
    while(board[tempClicked + 1]) {
        if(board[tempClicked + 1] == player && !isFirstCell(board[tempClicked + 1]) && !isLastCell(board[tempClicked + 1])) {
            horizontal ++;
            tempClicked ++;
            combos = combos.concat(tempClicked);
        } else break;
    }
    return (horizontal >= 5) ? {combos: combos, count: horizontal} : {combos: null, count: horizontal};
}

function checkVertical(board, clicked, player) {
    var vertical = 1;
    var tempClicked = clicked;
    var combos = [tempClicked];
    while(board[tempClicked - 30]) {
        if(board[tempClicked - 30] == player && !isFirstCell(board[tempClicked - 30]) && !isLastCell(board[tempClicked - 30])) {
            vertical ++;
            tempClicked -= 30;
            combos = combos.concat(tempClicked);
        }
        else break;
    }
    tempClicked = clicked;
    while(board[tempClicked + 30]) {
        if(board[tempClicked + 30] == player && !isFirstCell(board[tempClicked + 30]) && !isLastCell(board[tempClicked + 30])) {
            vertical ++;
            tempClicked += 30;
            combos = combos.concat(tempClicked);
        } else break;
    }
    return (vertical >= 5) ? {combos: combos, count: vertical} : {combos: null, count: vertical};
}

function getPlayerScore(board, clicked, player) {
    var rightDiagonal = checkRightDiagonal(board, clicked, player);
    var leftDiagonal = checkLeftDiagonal(board, clicked, player);
    var vertical = checkVertical(board, clicked, player);
    var horizontal = checkHorizontal(board, clicked, player);

    if(rightDiagonal.count >= 5 || leftDiagonal.count >= 5 || vertical.count >= 5 || horizontal.count >= 5) {
        return PLUS_INFINITY;
    } else if(rightDiagonal.count == 4 || leftDiagonal.count == 4 || vertical.count == 4 || horizontal.count == 4) {
        return NEUTRAL;
    } else if(rightDiagonal.count == 3 || leftDiagonal.count == 3 || vertical.count == 3 || horizontal.count == 3) {
        return NOT_ENOUGH;
    } else if(rightDiagonal.count == 2 || leftDiagonal.count == 2 || vertical.count == 2 || horizontal.count == 2) {
        return BADLY;
    } else if(rightDiagonal.count <= 1 || leftDiagonal.count <= 1 || vertical.count <= 1 || horizontal.count <= 1) {
        return MINUS_INFINITY;
    }
}

function checkWin(board, clicked, player) {
    let gameWon = null;

    var rightDiagonal = checkRightDiagonal(board, clicked, player);
    if(rightDiagonal.count >= 5) {
        return {combos: rightDiagonal.combos, player: player};
    }
    var leftDiagonal = checkLeftDiagonal(board, clicked, player);
    if(leftDiagonal.count >= 5) {
        return {combos: leftDiagonal.combos, player: player};
    }
    var vertical = checkVertical(board, clicked, player);
    if(vertical.count >= 5) {
        return {combos: vertical.combos, player: player};
    }
    var horizontal = checkHorizontal(board, clicked, player);
    if(horizontal.count >= 5) {
        return {combos: horizontal.combos, player: player};
    }

    return gameWon;
}

function isFirstCell(id) {
    for(var i = 0; i < 900; i = i + 30) {
        if(i == id)
            return true;
    }
    return false;
}

function isLastCell(id) {
    for(var i = 30; i <= 900; i = i + 30) {
        if((i - 1) == id)
            return true;
    }
    return false;
}

function gameOver(gameWon) {
    for(let index of gameWon.combos) {
        document.getElementById(index).style.backgroundColor = (gameWon.player == humanPlayer) ? coralColor : blueColor;
    }
    for(let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer ? "ХОЖЧИХЛОО Ш ДЭЭ, БАЯР ХҮРГЭЕ ДАА!" : "АЗГҮЙ ЮМ БЭ ХА ХА ХА!")
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot(clicked) {
    return minimax(origBoard, aiPlayer, clicked, 1).index;
}

function checkTie() {
    if(emptySquares().length == 0) {
        for(let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "#2EFE2E";
            cells[i].removeEventListener("click", turnClick, false);
            declareWinner("Tie game!");
        }
        return true;
    }
    return false;
}

function minimax(newBoard, player, lastClicked, depth) {
    var availSpots = emptySquares(newBoard);
    if(depth == 0) {
        return getPlayerScore(newBoard, lastClicked, player);
    }

    var moves = [];
    for(var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if(player == aiPlayer) {
            var result = minimax(newBoard, humanPlayer, availSpots[i], depth - 1);
            move.score = result;
        } else {
            var result = minimax(newBoard, aiPlayer, availSpots[i], depth - 1);
            move.score = result;
        }

        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    if(player == aiPlayer) {
        var bestScore = MINUS_INFINITY;
        for(var i = 0; i < moves.length; i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = PLUS_INFINITY;
        for(var i = 0; i < moves.length; i++) {
            if(moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    console.log(moves);
    return moves[bestMove];
}
