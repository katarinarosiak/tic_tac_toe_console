const readline = require('readline-sync');
const messages = require('./messages_tic_tac_toe.json');

const INITIAL_MARKER = ' ';
const CROSS = 'X'
const CIRCLE = "O"

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
  name: "",
  id: 'player1',
  human: true,
  chosenSign: CROSS,
  points: 0
}

let player2 = {
  name: "",
  id: 'player2',
  human: false,
  chosenSign: CIRCLE,
  points: 0
}

let gameStatus = {
  win: false,
  tie: false,
  takenSquares: 0,
  currentPlayer: player1,
  points: `Scores: Player 1: ${player1.points} points, Player 2: ${player2.points} points`
}




print(messages.welcome);
player1.name = print(messages.name);

let validNums = ['1', '2'];
let playWith = retriveInput(messages.player, messages.playWithValidity, validNums);

updateWhoIsPlaying(playWith, player2);

let validSigns = ["x", "o"];
let player1chosenSign = retriveInput(messages.chooseSign, messages.signValidity, validSigns);

assignSignsToPlayers(player1chosenSign, player1, player2);

printBoard(gameBoard);

while (!gameStatus.win || !gameStatus.tie) {
  let validSquares = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];
  let squareId = retriveInput(messages.chooseSquare, messages.ivalidSquare, validSquares);

  placeSignToBoard(squareId, gameBoard, gameStatus);
  printBoard(gameBoard);

  gameStatus.win = checkIfWin(gameBoard, gameStatus);
  announceGameStatus(gameStatus.win, messages.congratulation);

  gameStatus.tie = checkIfTie(gameStatus.takenSquares);
  announceGameStatus(gameStatus.tie, messages.tie);

  let validAnswers = ["yes", "Yes", "Y", "y", "No", "NO", "no", "n", "N"];
  if (gameStatus.win || gameStatus.tie) {
    let playAgain = retriveInput(messages.playAgain, messages.invalidYesNo, validAnswers);
    console.log(playAgain);
    if (playAgain[0].toLowerCase === 'y') {
      playAgain();
    } else {
      console.log();
      return;
    }
  }
  changeTurn(gameStatus);
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
    console.log(true);
  } else {
    player1Obj.chosenSign = CIRCLE;
    player2Obj.chosenSign = CROSS;
    console.log(initialchosenSign);
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

function placeSignToBoard(square, board, game) {
  if (board[square] === INITIAL_MARKER) {
    board[square] = game.currentPlayer.chosenSign;
    game.takenSquares++;
  } else {
    print(messages.emptySquare);
  }
}

function checkIfWin(board, gameNow) {

  let winCombination = [
    ['a1', 'a2', 'a3'], ['b1', 'b2', 'b3'], ['c1', 'c2', 'c3'],
    ['d1', 'b1', 'c1'], ['a2', 'b2', 'c2'], ['a3', 'b3', 'c3'],
    ['a1', 'b2', 'c3']['c1', 'b2', 'a2']
  ];

  for (let line = 0; line < winCombination.length; line++) {
    let [sq1, sq2, sq3] = winCombination[line];

    if (
      board[sq1] === gameNow.currentPlayer.chosenSign &&
      board[sq2] === gameNow.currentPlayer.chosenSign &&
      board[sq3] === gameNow.currentPlayer.chosenSign
    ) {
      return true;
    } else {
      return false;
    }
  }
}

function checkIfTie(board) {
  if (board === 9) {
    return true;
  } else {
    return false;
  }
}

function announceGameStatus(gameNow, message) {
  if (gameNow) {
    print(message);
    console.log(gameNow.points);
  }
}

function changeTurn(game) {
  if (game.currentPlayer.id === 'player1') {
    game.currentPlayer = player2;
  } else {
    game.currentPlayer = player1;
  }
}

function playAgain() {
  console.log('play again');
}
