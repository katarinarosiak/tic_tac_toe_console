const readline = require('readline-sync');
const messages = require('./messages_tic_tac_toe.json');
const VALID_ANSWERS = require('./valid_answers.json');


function print(message, name) {
  console.log(`=> ${name}, ${message}`)
}

function validateInput(input, validInputs) {
  return validInputs.includes(input);
}

function retriveInput(question, notValidMessage, validInputs, name) {
  print(question, name);
  let userAnswer = readline.question('');
  let isValid = validateInput(userAnswer, validInputs);
  while (!isValid) {
    print(notValidMessage, name);
    print(question, name);
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

function assignSignsToPlayers(initialchosenSign, playersObj, signs) {
  if (initialchosenSign === "x") {
    playersObj.player1.chosenSign = signs.cross;
    playersObj.player2.chosenSign = signs.circle;

  } else {
    playersObj.player1.chosenSign = signs.circle;
    playersObj.player2.chosenSign = signs.cross;
  }
}

function printBoard(board) {

  let line = '      ---+---+---';
  let numRow = `       1   2   3   `;
  let firstRow = `     a ${board.a1} | ${board.a2} | ${board.a3} `;
  let secondRow = `     b ${board.b1} | ${board.b2} | ${board.b3} `;
  let thirdRow = `     c ${board.c1} | ${board.c2} | ${board.c3} `;

  console.log(' ');
  console.log(numRow);
  console.log(firstRow);
  console.log(line);
  console.log(secondRow);
  console.log(line);
  console.log(thirdRow);
  console.log(' ');
}


function humanChooseSquare(messages, board, initialMarker, validAnswers, name) {
  let chosenSquare = retriveInput(messages.chooseSquare, messages.ivalidSquare, VALID_ANSWERS.validSquares, name);

  while (board[chosenSquare] !== initialMarker) {

    print(messages.emptySquare, name);
    chosenSquare = retriveInput(messages.chooseSquare, messages.ivalidSquare, validAnswers.validSquares, name);
  }
  return chosenSquare;
}

function checkIfEmpty(square, game, sign) {
  return (game.gameBoard[square] === sign.initialMarker);
}

function placeSignToBoard(messages, square, game, sign) {
  if (checkIfEmpty(square, game, sign)) {
    game.gameBoard[square] = game.currentPlayer.chosenSign;
    game.takenSquares++;
  } else {
    print(messages.emptySquare, game.currentPlayer.name);
    print(messages.emptySquare, game.currentPlayer.name);
  }
}

function checkIfWin(game, winCombination) {
  for (let line = 0; line < winCombination.length; line++) {
    let [sq1, sq2, sq3] = winCombination[line];


    if (
      game.gameBoard[sq1] === game.currentPlayer.chosenSign &&
      game.gameBoard[sq2] === game.currentPlayer.chosenSign &&
      game.gameBoard[sq3] === game.currentPlayer.chosenSign
    ) {
      return true;
    }
  }
  return false;
}


function checkIfTie(board) {
  if (board.takenSquares === 9) {
    return true;
  } else {
    return false;
  }
}


function incrementPoints(game) {
  if (game.win) {
    game.currentPlayer.points++;
  }
}


function announceGameStatus(message, playerObj, name) {
  print(message, name);
  console.log(`=> Player 1 has ${playerObj.player1.points} points and Player 2 has ${playerObj.player1.points} points`);
}

function changeTurn(game, messages, players) {
  if (game.currentPlayer.id === 'player1') {
    game.currentPlayer = players.player2;
  } else {
    game.currentPlayer = players.player1;
  }
  print(messages.YourTurn, game.currentPlayer.name);
}

////////////////////////////////////////////////////////
function computerChooseSquareEasy(game, sign) {
  let squares = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
  let computerChoice = randomChooseBetween(squares);

  while (!checkIfEmpty(computerChoice, game, sign)) {
    computerChoice = randomChooseBetween(squares);
  }
  return computerChoice;
}


function randomChooseBetween(squares) {
  return squares[Math.floor(Math.random() * squares.length)];
}


function restartGame(game, players) {
  clearScreen();
  printBoard(game.gameBoard);

  resetGameStatus(game, players);
  game.round++;
  choosePlayerForFirstMove(players, game);
}

function choosePlayerForFirstMove(players, game) {

  if (game.round % 2 === 1) {
    game.currentPlayer = players.player1;
  } else {
    game.currentPlayer = players.player2;
  }
}


function clearScreen() {
  for (let i = 0; i < 22; i++) {
    console.log(" ");
  }
}


function resetGameStatus(game, players) {
  game.win = false;
  game.tie = false;
  game.takenSquares = 0;
  game.currentPlayer = players.player1;
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
  console.log("      |||      ||||||||  ||  ||||||   || || ||");
  console.log("     || ||        ||     ||  ||       || || ||");
  console.log("    ||   ||       ||     ||  |||      || || ||");
  console.log("    |||||||       ||     ||  ||               ");
  console.log("   ||     ||      ||     ||  ||||||   || || ||");
  console.log("");
}


function computerChooseSquareHard(game, winCombination, validSquares, sign) {
  let computerChoice = "";
  let strategicSquares = ['a1', 'a3', 'b2', 'c1', 'c3'];
  if (game.takenSquares <= 2) {
    computerChoice = randomChooseBetween(strategicSquares);
    console.log(computerChoice);
    while (!checkIfEmpty(computerChoice, game, sign)) {
      computerChoice = randomChooseBetween(strategicSquares);
    }
  } else if (game.takenSquares >= 3) {
    computerChoice = computerOffense(game, validSquares);
    if (!computerChoice) {
      computerDeffense(game, validSquares)
    } else {
      computerChoice = randomChooseBetween(strategicSquares);
      while (!checkIfEmpty(computerChoice, game, sign)) {
        computerChoice = randomChooseBetween(strategicSquares);
      }
    }
  }
  return computerChoice;
}

function computerOffense(game, validSquares, sign) {
  let computerChoice;
  //loop through winningcombination
  //compare it to the current board
  //check if
  computerChoice = randomChooseBetween(validSquares);
  while (!checkIfEmpty(computerChoice, game, sign)) {
    computerChoice = randomChooseBetween(validSquares);
  }
  console.log('computer offense');
  return computerChoice;
}


function computerDeffense(game, validSquares, sign) {
  let computerChoice;
  //loop through winningcombination
  //compare it to the current board
  //check if
  computerChoice = randomChooseBetween(validSquares);
  while (!checkIfEmpty(computerChoice, game, sign)) {
    computerChoice = randomChooseBetween(validSquares);
  }
  console.log('computer defense');
  return computerChoice;
}

module.exports.computerChooseSquareExtreme = computerChooseSquareExtreme;

function computerChooseSquareExtreme(board, game) {
  console.log('computer move extreme');
}


module.exports.print = print;
module.exports.validateInput = validateInput;
module.exports.retriveInput = retriveInput;
module.exports.updateWhoIsPlaying = updateWhoIsPlaying;
module.exports.assignSignsToPlayers = assignSignsToPlayers;
module.exports.printBoard = printBoard;
module.exports.humanChooseSquare = humanChooseSquare;
module.exports.checkIfEmpty = checkIfEmpty;
module.exports.placeSignToBoard = placeSignToBoard;
module.exports.checkIfWin = checkIfWin;
module.exports.checkIfTie = checkIfTie;
module.exports.incrementPoints = incrementPoints;
module.exports.announceGameStatus = announceGameStatus;
module.exports.changeTurn = changeTurn;
module.exports.computerChooseSquareEasy = computerChooseSquareEasy;
module.exports.randomChooseBetween = randomChooseBetween;
module.exports.restartGame = restartGame;
module.exports.choosePlayerForFirstMove = choosePlayerForFirstMove;
module.exports.clearScreen = clearScreen;
module.exports.resetGameStatus = resetGameStatus;
module.exports.initializeGameBoard = initializeGameBoard;
module.exports.printCongratulation = printCongratulation;
module.exports.printTie = printTie;
module.exports.computerChooseSquareHard = computerChooseSquareHard;
module.exports.computerOffense = computerOffense;
module.exports.computerDeffense = computerDeffense;
module.exports.computerChooseSquareExtreme = computerChooseSquareExtreme;


//working on now
// function computerMove(game, winCombination, board) {
//   if (game.takenSquares < 2) {
//     let firstMove = ['a1', 'a3', 'b2', 'c1', 'c3'];
//     let computerChoice = randomChooseBetween(firstMove);
//     while (!checkIfEmpty(computerChoice, board)) {
//       computerChoice = randomChooseBetween(firstMove);
//       placeSignToBoard(computerChoice, board, game);
//     }
//   } else if (game.takenSquares > 2) {
//     computerChoice = chooseIfChanceToWin();
//     if (computerChoice) {
//       computerChoice = computerDefend();
//     }
//     placeSignToBoard(computerChoice, board, game);
//   }
// }


// working on  now
// function chooseIfChanceToWin(board, winCombination) {

//   for (let line = 0; line < winCombination.length; line++) {
//     let [sq1, sq2, sq3] = winCombination[line];

//     if (
//       (board[sq1] === gameNow.currentPlayer.chosenSign &&
//         board[sq2] === gameNow.currentPlayer.chosenSign)
//       ||
//       (board[sq1] === gameNow.currentPlayer.chosenSign &&
//         board[sq3] === gameNow.currentPlayer.chosenSign)
//       ||
//       (board[sq2] === gameNow.currentPlayer.chosenSign &&
//         board[sq3] === gameNow.currentPlayer.chosenSign)
//     ) {
//       return true;
//     }
//   }
//   return false;
// }