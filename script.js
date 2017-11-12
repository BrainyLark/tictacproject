var origBoard;
const humanPlayer = 'O'
const aiPlayer = 'X'

initTable()
const cells = document.querySelectorAll(".cell")
startGame()

function startGame() {
    document.querySelector(".endgame").style.display = "none"
    origBoard = Array.from(Array(900).keys())

    for(var i = 0; i < cells.length; i++) {
        cells[i].innerText = '' //i
        cells[i].style.removeProperty('background-color')
        cells[i].addEventListener("click", turnClick, false)
    }
}

function initTable() {
    var table = document.getElementById("mainTable")
    for(var i = 0; i < 30; i++) {
        var row = table.insertRow(i)
        for(var j = 0; j < 30; j++) {
            var cell = row.insertCell(j)
            cell.id = i * 29 + i + j
            cell.className = "cell"
        }
    }
}

function turnClick(square) {
    if(typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, humanPlayer)
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player
    document.getElementById(squareId).innerText = player

    let gameWon = checkWin(origBoard, parseInt(squareId), player)
    //alert("Winning combo: " + JSON.stringify(gameWon.combos) + "\n" + " player : " + gameWon.player)
    //if(gameWon) gameOver(gameWon)
}

function checkWin(board, clicked, player) {
    var horizontal = 1
    var vertical = 1
    var leftDiagonal = 1
    var rightDiagonal = 1
    var tempClicked = clicked
    let gameWon = null
    let wonCombos = [clicked]

    while(board[tempClicked - 29]) {
        if(board[tempClicked - 29] == player) {
            rightDiagonal ++
            tempClicked -= 29
            wonCombos = wonCombos.concat(tempClicked)
        }
        else break
    }
    tempClicked = clicked
    while(board[tempClicked + 29]) {
        if(board[tempClicked + 29] == player) {
            rightDiagonal ++
            tempClicked += 29
            wonCombos = wonCombos.concat(tempClicked)
        }
        else break
    }

    if(rightDiagonal == 5) {
        gameWon = {combos: wonCombos, player: player}
        return gameWon
    } else {
        wonCombos = [clicked]
    }

    tempClicked = clicked
    while(board[tempClicked - 31]) {
        if(board[tempClicked - 31] == player) {
            leftDiagonal ++
            tempClicked -= 31
            wonCombos = wonCombos.concat(tempClicked)
        }
        else break
    }
    tempClicked = clicked
    while(board[tempClicked + 31]) {
        if(board[tempClicked + 31] == player) {
            leftDiagonal ++
            tempClicked += 31
            wonCombos = wonCombos.concat(tempClicked)
        }
        else break
    }

    if(leftDiagonal == 5) {
        gameWon = {combos: wonCombos, player: player}
        return gameWon
    } else {
        wonCombos = [clicked]
    }

    tempClicked = clicked
    while(board[tempClicked - 1]) {
        if(board[tempClicked - 1] == player && !isFirstCell(board[tempClicked - 1]) && !isLastCell(board[tempClicked - 1])) {
            horizontal ++
            tempClicked --
            wonCombos = wonCombos.concat(tempClicked)
        }
        else break
    }
    tempClicked = clicked
    while(board[tempClicked + 1]) {
        if(board[tempClicked + 1] == player && !isFirstCell(board[tempClicked + 1]) && !isLastCell(board[tempClicked + 1])) {
            horizontal ++
            tempClicked ++
            wonCombos = wonCombos.concat(tempClicked)
        } else break
    }

    if(horizontal == 5) {
        gameWon = {combos: wonCombos, player: player}
        return gameWon
    } else {
        wonCombos = [clicked]
    }

    tempClicked = clicked
    while(board[tempClicked - 30]) {
        if(board[tempClicked - 30] == player && !isFirstCell(board[tempClicked - 30]) && !isLastCell(board[tempClicked - 30])) {
            vertical ++
            tempClicked -= 30
            wonCombos = wonCombos.concat(tempClicked)
        }
        else break
    }
    tempClicked = clicked
    while(board[tempClicked + 30]) {
        if(board[tempClicked + 30] == player && !isFirstCell(board[tempClicked + 30]) && !isLastCell(board[tempClicked + 30])) {
            vertical ++
            tempClicked += 30
            wonCombos = wonCombos.concat(tempClicked)
        } else break
    }

    if(vertical == 5) {
        gameWon = {combos: wonCombos, player: player}
        return gameWon
    } else {
        wonCombos = [clicked]
    }

    return gameWon
}

function isFirstCell(id) {
    for(var i = 0; i < 900; i = i + 30) {
        if(i == id)
            return true
    }
    return false
}

function isLastCell(id) {
    for(var i = 30; i <= 900; i = i + 30) {
        if((i - 1) == id)
            return true
    }
    return false
}

function gameOver(gameWon) {

}
