const readline = require('readline-sync');
const messages = require('./messages_tic_tac_toe.json');
const VALID_ANSWERS = require('./valid_answers.json');



const INITIAL_MARKER = ' ';
const CROSS = 'X'
const CIRCLE = "O"

let WIN_COMBINATION = [
  ['a1', 'a2', 'a3'], ['b1', 'b2', 'b3'], ['c1', 'c2', 'c3'],
  ['a1', 'b1', 'c1'], ['a2', 'b2', 'c2'], ['a3', 'b3', 'c3'],
  ['a1', 'b2', 'c3'], ['c1', 'b2', 'a3']
];

let gameBoard = {
  a1: INITIAL_MARKER,
  a2: INITIAL_MARKER,
  a3: INITIAL_MARKER,
  b1: INITIAL_MARKER,
  b2: INITIAL_MARKER,
  b3: INITIAL_MARKER,
  c1: INITIAL_MARKER,
  c2: INITIAL_MARKER,
  c3: INITIAL_MARKER
};


let player1 = {
  id: 'player1',
  human: true,
  chosenSign: CROSS,
  points: 0
}

let player2 = {
  id: 'player2',
  human: false,
  chosenSign: CIRCLE,
  points: 0
}

let gameStatus = {
  win: false,
  tie: false,
  takenSquares: 0,
  round: 0,
  currentPlayer: player1,
}




print(messages.welcome);

let playWith = retriveInput(messages.player, messages.playWithValidity, VALID_ANSWERS.validNums);
updateWhoIsPlaying(playWith, player2);

let player1chosenSign = retriveInput(messages.chooseSign, messages.signValidity, VALID_ANSWERS.validSigns);
assignSignsToPlayers(player1chosenSign, player1, player2);

printBoard(gameBoard);

while (!gameStatus.win || !gameStatus.tie) {

  let squareId = retriveInput(messages.chooseSquare, messages.ivalidSquare, VALID_ANSWERS.validSquares);

  while (gameBoard[squareId] !== INITIAL_MARKER) {
    print(messages.emptySquare);
    squareId = retriveInput(messages.chooseSquare, messages.ivalidSquare, VALID_ANSWERS.validSquares);
  }

  placeSignToBoard(squareId, gameBoard, gameStatus);
  clearScreen();
  printBoard(gameBoard);

  gameStatus.win = checkIfWin(gameBoard, gameStatus, WIN_COMBINATION);
  incrementPoints(gameStatus);
  announceGameStatus(gameStatus.win, messages.congratulation, player1.points, player2.points);


  gameStatus.tie = checkIfTie(gameStatus.takenSquares);
  announceGameStatus(gameStatus.tie, messages.tie, player1.points, player2.points);


  if (gameStatus.win || gameStatus.tie) {
    let playAgain = retriveInput(messages.playAgain, messages.invalidYesNo, VALID_ANSWERS.validAnswers);

    if (playAgain.toLowerCase().slice(0, 1) === 'y') {
      gameBoard = initializeGameBoard(3, INITIAL_MARKER);
      restartGame(gameBoard, gameStatus, player1, player2);
    } else {
      return;
    }
  }

  changeTurn(gameStatus);
  if (!player2.human) {
    computerMove(gameStatus, WIN_COMBINATION);
  }
}




//helper functions
function print(message) {
  console.log(`=> ${message}`);
}

function validateInput(input, validInputs) {
  return validInputs.includes(input);
}


function retriveInput(question, notValidMessage, validInputs) {
  print(question);
  let userAnswer = readline.question('');
  let isValid = validateInput(userAnswer, validInputs);
  while (!isValid) {
    print(notValidMessage);
    print(question);
    userAnswer = readline.question('');
    isValid = validateInput(userAnswer, validInputs);
  }

  return userAnswer;
}

function updateWhoIsPlaying(userPlayWith, player2Obj) {
  if (userPlayWith === '1') {
    player2Obj.human = true;
  } else {
    player2Obj.human = false;
  }
}

function assignSignsToPlayers(initialchosenSign, player1Obj, player2Obj) {
  if (initialchosenSign === "x") {
    player1Obj.chosenSign = CROSS;
    player2Obj.chosenSign = CIRCLE;
  } else {
    player1Obj.chosenSign = CIRCLE;
    player2Obj.chosenSign = CROSS;
  }
}

function printBoard(board) {

  let line = ' ---+---+---';
  let numRow = `  1   2   3   `;
  let firstRow = `a ${board.a1} | ${board.a2} | ${board.a3} `;
  let secondRow = `b ${board.b1} | ${board.b2} | ${board.b3} `;
  let thirdRow = `c ${board.c1} | ${board.c2} | ${board.c3} `;

  console.log(numRow);
  console.log(firstRow);
  console.log(line);
  console.log(secondRow);
  console.log(line);
  console.log(thirdRow);
}
function checkIfEmpty(square, board) {
  return (board[square] === INITIAL_MARKER)
}
function placeSignToBoard(square, board, game) {
  if (checkIfEmpty(square, board)) {
    board[square] = game.currentPlayer.chosenSign;
    game.takenSquares++;
  } else {
    print(messages.emptySquare);
  }
}

function checkIfWin(board, gameNow, winCombination) {

  for (let line = 0; line < winCombination.length; line++) {
    let [sq1, sq2, sq3] = winCombination[line];

    if (
      board[sq1] === gameNow.currentPlayer.chosenSign &&
      board[sq2] === gameNow.currentPlayer.chosenSign &&
      board[sq3] === gameNow.currentPlayer.chosenSign
    ) {
      return true;
    }
  }
  return false;
}

function checkIfTie(board) {
  if (board === 9) {
    return true;
  } else {
    return false;
  }
}

function incrementPoints(gameNow) {
  if (gameNow.win) {
    gameNow.currentPlayer.points++;
  }
}

function announceGameStatus(gameNow, message, player1Score, player2Score,) {
  if (gameNow) {

    print(message);
    console.log(`=> Player 1 has ${player1Score} points and Player 2 has ${player2Score} points`);
  }
}

function changeTurn(game) {
  if (game.currentPlayer.id === 'player1') {
    game.currentPlayer = player2;
    console.log("Your turn player2");
  } else {
    game.currentPlayer = player1;
    console.log("Your turn player1");
  }
}
//working on now
function computerMove(game, winCombination, board) {
  if (game.takenSquares < 2) {
    let firstMove = ['a1', 'a3', 'b2', 'c1', 'c3'];
    let computerChoice = randomChooseBetween(firstMove);
    while (!checkIfEmpty(computerChoice, board)) {
      computerChoice = randomChooseBetween(firstMove);
      placeSignToBoard(computerChoice, board, game);
    }
  } else if (game.takenSquares > 2) {
    computerChoice = chooseIfChanceToWin();
    if (computerChoice) {
      computerChoice = computerDefend();
    }
    placeSignToBoard(computerChoice, board, game);
  }
}

function randomChooseBetween(squares) {
  return squares[Math.floor(Math.random() * squares.length)];
}
// working on  now
function chooseIfChanceToWin(board, winCombination) {

  for (let line = 0; line < winCombination.length; line++) {
    let [sq1, sq2, sq3] = winCombination[line];

    if (
      (board[sq1] === gameNow.currentPlayer.chosenSign &&
        board[sq2] === gameNow.currentPlayer.chosenSign)
      ||
      (board[sq1] === gameNow.currentPlayer.chosenSign &&
        board[sq3] === gameNow.currentPlayer.chosenSign)
      ||
      (board[sq2] === gameNow.currentPlayer.chosenSign &&
        board[sq3] === gameNow.currentPlayer.chosenSign)
    ) {
      return true;
    }
  }
  return false;
}

function restartGame(board, game, firstPlayer, secondPlayer) {
  clearScreen();
  printBoard(board);
  resetGameStatus(game);
  game.round++;
  if (game.round % 2 === 1) {
    board.currentPlayer = firstPlayer;
    console.log(game.round);
    console.log("turn changed to player1");
  } else {
    board.currentPlayer = secondPlayer;
    console.log(game.round);
    console.log('turn changed to player2');
  }
}

function clearScreen() {
  for (let i = 0; i < 22; i++) {
    console.log(" ");
  }
}

function resetGameStatus(game) {
  game.win = false;
  game.tie = false;
  game.takenSquares = 0;
  game.currentPlayer = player1;
}

function initializeGameBoard(size, initialVal) {
  let obj = {};
  let rows = ['a', 'b', 'c'];

  for (let col = 1; col <= size; col++) {
    for (let row = 0; row < size; row++) {
      obj[rows[row] + col] = initialVal;
    }
  }
  return obj;
}



//not implemented 
function printCongratulation() {
  console.log('')
  console.log("||  ||   ||   ||  ||    ||    ||    ||   ||     ||  || || ||");
  console.log(" ||||   ||||  ||  ||    ||    ||   ||||  ||||   ||  || || ||");
  console.log("  ||   ||  || ||  ||    ||    ||  ||  || || ||  ||  || || ||");
  console.log("  ||    ||||  ||  ||    || || ||   ||||  ||  || ||          ");
  console.log("  ||     ||     ||       ||||||     ||   ||   ||||  || || ||");
  console.log("");
}

function printTie() {
  console.log("");
  console.log("|| |||||||| ||  |||        |||      ||||||||  ||  ||||||   || ||  ||");
  console.log("||    ||       ||  |      || ||        ||     ||  ||       || || ||");
  console.log("||    ||        ||       ||   ||       ||     ||  |||      || || ||");
  console.log("||    ||      |   ||     |||||||       ||     ||  ||         ");
  console.log("||    ||       ||||     ||     ||      ||     ||  ||||||   || || ||");
  console.log("");
}

