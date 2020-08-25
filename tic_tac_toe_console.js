const readline = require('readline-sync');
const messages = require('./messages_tic_tac_toe.json');

//start the first loop
//info: sign? computer? player? name?
//display the board 
//second game loop 
// choice
//print
//check
//choice 
//until let taken = 9 || win = true
// again? 
let gameBoard = {
  a1: ' ',
  a2: ' ',
  a3: ' ',
  b1: ' ',
  b2: ' ',
  b3: ' ',
  c1: ' ',
  c2: ' ',
  c3: ' '
};

let winCombination = [];

let gameStatus = {
  signs: { cross: 'X', circle: 'O' },
  win: false,
  takenSquares: 0,
}



print(messages.welcome);

let validNums = ['1', '2'];
let playWith = retriveInput(messages.player, messages.playWithValidity, validNums);


let validSigns = ["x", "o", "X", "O"];
let player1 = retriveInput(messages.chooseSign, messages.signValidity, validSigns);
let player2 = assignSignsToSecondPlayers(player1);
let currentPlayer = player1

printBoard(gameBoard);
let validSquares = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];
let squareId = retriveInput(messages.chooseSquare, messages.ivalidSquare, validSquares);


placeSignToBoard(currentPlayer, squareId, gameBoard);
printBoard(gameBoard);

checkIfWin();
checkIfTie();

changeTurn(currentPlayer, gameStatus);





//helper functions
function print(message) {
  console.log(`=> ${message}`);
}

function validateInput(input, validInputs) {
  return validInputs.includes(input);
}

//print question, save input in var, validate input, keep getting until right, return input val. 
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

function assignSignsToSecondPlayers(firstPlayer) {
  if (firstPlayer.toUpperCase === "X") {
    return "O";
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

function placeSignToBoard(player, square, board) {
  if (board[square] === " ") {
    board[square] = player;
  } else {
    print(messages.emptySquare);
  }
}

function checkIfWin(board) {

}

function checkIfTie(board) {

}

// function changeTurn(player, playsWith, gameInfo) {
//   gameInfo.takenSquares++;
//   if (currentPlayer)
//     currentPlayer = 
// }