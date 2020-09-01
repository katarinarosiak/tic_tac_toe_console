const readline = require('readline-sync');
const messages = require('./messages_tic_tac_toe.json');
const VALID_ANSWERS = require('./valid_answers.json');
const HELPERS = require('./helpers.js');

let signs = {
  initialMarker: ' ',
  cross: 'X',
  circle: 'O'
}

const WIN_COMBINATION = [
  ['a1', 'a2', 'a3'], ['b1', 'b2', 'b3'], ['c1', 'c2', 'c3'],
  ['a1', 'b1', 'c1'], ['a2', 'b2', 'c2'], ['a3', 'b3', 'c3'],
  ['a1', 'b2', 'c3'], ['c1', 'b2', 'a3']
];

let players = {
  player1: {
    id: 'player1',
    name: 'player1',
    human: true,
    chosenSign: signs.cross,
    points: 0
  },
  player2: {
    id: 'player2',
    name: 'player2',
    human: false,
    chosenSign: signs.circle,
    points: 0
  }
};

let gameStatus = {
  win: false,
  tie: false,
  takenSquares: 0,
  round: 1,
  level: 1,
  currentPlayer: players.player1,
  gameBoard: {
    a1: signs.initialMarker,
    a2: signs.initialMarker,
    a3: signs.initialMarker,
    b1: signs.initialMarker,
    b2: signs.initialMarker,
    b3: signs.initialMarker,
    c1: signs.initialMarker,
    c2: signs.initialMarker,
    c3: signs.initialMarker
  }
}


HELPERS.clearScreen();
HELPERS.print(messages.welcome, ' ');

gameStatus.currentPlayer.name = readline.question('What is your name?');

let playWith = HELPERS.retriveInput(messages.player, messages.playWithValidity, VALID_ANSWERS.validNums, gameStatus.currentPlayer.name);
HELPERS.updateWhoIsPlaying(playWith, players.player2);

if (playWith === '1') {
  players.player2.name = readline.question('What is your name of player 2?');
} else {
  gameStatus.level = HELPERS.retriveInput(messages.level, messages.levelValidity, VALID_ANSWERS.validLevel, gameStatus.currentPlayer.name);
}

let player1chosenSign = HELPERS.retriveInput(messages.chooseSign, messages.signValidity, VALID_ANSWERS.validSigns, gameStatus.currentPlayer.name);

HELPERS.assignSignsToPlayers(player1chosenSign, players, signs);
HELPERS.clearScreen();
HELPERS.printBoard(gameStatus.gameBoard);

while (!gameStatus.win || !gameStatus.tie) {

  let squareId = '';

  if (gameStatus.currentPlayer.human) {
    squareId = HELPERS.humanChooseSquare(messages, gameStatus.gameBoard, signs.initialMarker, VALID_ANSWERS, gameStatus.currentPlayer.name);

  } else if (gameStatus.level === "1") {
    squareId = HELPERS.computerChooseSquareEasy(gameStatus, signs);


  } else if (gameStatus.level === "2") {
    squareId = HELPERS.computerChooseSquareHard(gameStatus, WIN_COMBINATION, signs);

  } else {
    squareId = HELPERS.computerChooseSquareExtreme(gameStatus);
  }

  HELPERS.clearScreen();
  HELPERS.placeSignToBoard(messages, squareId, gameStatus, signs);
  HELPERS.printBoard(gameStatus.gameBoard);



  gameStatus.win = HELPERS.checkIfWin(gameStatus, WIN_COMBINATION);
  if (gameStatus.win) {

    HELPERS.incrementPoints(gameStatus);
    HELPERS.printCongratulation();
    HELPERS.announceGameStatus(messages.congratulation, players, gameStatus.currentPlayer.name);
  } else if (!gameStatus.win) {
    gameStatus.tie = HELPERS.checkIfTie(gameStatus);
    if (gameStatus.tie) {
      HELPERS.printTie();
      HELPERS.announceGameStatus(messages.tie, players, gameStatus.currentPlayer.name)
    }
  }

  if (gameStatus.win || gameStatus.tie) {
    let playAgain = HELPERS.retriveInput(messages.playAgain, messages.invalidYesNo, VALID_ANSWERS.validAnswers, gameStatus.currentPlayer.name);

    if (playAgain.toLowerCase().slice(0, 1) === 'y') {

      gameStatus.gameBoard = HELPERS.initializeGameBoard(3, signs.initialMarker);

      HELPERS.restartGame(gameStatus, players);


    } else {
      HELPERS.print(messages.thankYou, gameStatus.currentPlayer.name);
      return;
    }
  } else {
    HELPERS.changeTurn(gameStatus, messages, players);
  }

}




//helper functions
// function print(message, name) {
//   console.log(`=> ${name}, ${message}`);
// }

// function validateInput(input, validInputs) {
//   return validInputs.includes(input);
// }


// function retriveInput(question, notValidMessage, validInputs, name) {
//   print(question, name);
//   let userAnswer = readline.question('');
//   let isValid = validateInput(userAnswer, validInputs);
//   while (!isValid) {
//     print(notValidMessage, name);
//     print(question, name);
//     userAnswer = readline.question('');
//     isValid = validateInput(userAnswer, validInputs);
//   }

//   return userAnswer;
// }

// function updateWhoIsPlaying(userPlayWith, player2Obj) {
//   if (userPlayWith === '1') {
//     player2Obj.human = true;
//   } else {
//     player2Obj.human = false;
//   }
// }

// function assignSignsToPlayers(initialchosenSign, player1Obj, player2Obj) {
//   if (initialchosenSign === "x") {
//     player1Obj.chosenSign = CROSS;
//     player2Obj.chosenSign = CIRCLE;
//   } else {
//     player1Obj.chosenSign = CIRCLE;
//     player2Obj.chosenSign = CROSS;
//   }
// }

// function printBoard(board) {

//   let line = '      ---+---+---';
//   let numRow = `       1   2   3   `;
//   let firstRow = `     a ${board.a1} | ${board.a2} | ${board.a3} `;
//   let secondRow = `     b ${board.b1} | ${board.b2} | ${board.b3} `;
//   let thirdRow = `     c ${board.c1} | ${board.c2} | ${board.c3} `;

//   console.log(' ');
//   console.log(numRow);
//   console.log(firstRow);
//   console.log(line);
//   console.log(secondRow);
//   console.log(line);
//   console.log(thirdRow);
//   console.log(' ');
// }

// function humanChooseSquare(messages, board, initialMarker, validAnswers, name) {
//   let chosenSquare = retriveInput(messages.chooseSquare, messages.ivalidSquare, VALID_ANSWERS.validSquares, name);

//   while (board[chosenSquare] !== initialMarker) {
//     print(messages.emptySquare, name);
//     chosenSquare = retriveInput(messages.chooseSquare, messages.ivalidSquare, validAnswers.validSquares);
//   }
//   return chosenSquare;
// }

// function checkIfEmpty(square, board) {
//   return (board[square] === INITIAL_MARKER)
// }

// function placeSignToBoard(messages, square, board, game, name) {
//   if (checkIfEmpty(square, board)) {
//     board[square] = game.currentPlayer.chosenSign;
//     game.takenSquares++;
//   } else {
//     print(messages.emptySquare, name);
//   }
// }

// function checkIfWin(board, gameNow, winCombination) {

//   for (let line = 0; line < winCombination.length; line++) {
//     let [sq1, sq2, sq3] = winCombination[line];

//     if (
//       board[sq1] === gameNow.currentPlayer.chosenSign &&
//       board[sq2] === gameNow.currentPlayer.chosenSign &&
//       board[sq3] === gameNow.currentPlayer.chosenSign
//     ) {
//       return true;
//     }
//   }
//   return false;
// }

// function checkIfTie(board) {
//   if (board === 9) {
//     return true;
//   } else {
//     return false;
//   }
// }

// function incrementPoints(gameNow) {
//   if (gameNow.win) {
//     gameNow.currentPlayer.points++;
//   }
// }

// function announceGameStatus(message, player1Score, player2Score, name) {
//   print(message, name);
//   console.log(`=> Player 1 has ${player1Score} points and Player 2 has ${player2Score} points`);
// }

// function changeTurn(game) {
//   if (game.currentPlayer.id === 'player1') {
//     game.currentPlayer = player2;
//   } else {
//     game.currentPlayer = player1;
//   }
//   print(messages.YourTurn, game.currentPlayer.name);
// }


// function computerChooseSquareEasy(board) {
//   let squares = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
//   let computerChoice = randomChooseBetween(squares);
//   while (!checkIfEmpty(computerChoice, board)) {
//     computerChoice = randomChooseBetween(squares);
//   }
//   return computerChoice;
// }

// function randomChooseBetween(squares) {
//   return squares[Math.floor(Math.random() * squares.length)];
// }

// function restartGame(board, game, firstPlayer, secondPlayer, name) {
//   clearScreen();
//   printBoard(board, name);
//   resetGameStatus(game, name);
//   game.round++;
//   choosePlayerForFirstMove(firstPlayer, secondPlayer, game, board)
// }

// function choosePlayerForFirstMove(firstPlayer, secondPlayer, game, board) {
//   if (game.round % 2 === 1) {
//     board.currentPlayer = firstPlayer;
//   } else {
//     board.currentPlayer = secondPlayer;
//   }
// }

// function clearScreen() {
//   for (let i = 0; i < 22; i++) {
//     console.log(" ");
//   }
// }

// function resetGameStatus(game) {
//   game.win = false;
//   game.tie = false;
//   game.takenSquares = 0;
//   game.currentPlayer = player1;
// }

// function initializeGameBoard(size, initialVal) {
//   let obj = {};
//   let rows = ['a', 'b', 'c'];

//   for (let col = 1; col <= size; col++) {
//     for (let row = 0; row < size; row++) {
//       obj[rows[row] + col] = initialVal;
//     }
//   }
//   return obj;
// }



// //not implemented 
// function printCongratulation() {
//   console.log('')
//   console.log("||  ||   ||   ||  ||    ||    ||    ||   ||     ||  || || ||");
//   console.log(" ||||   ||||  ||  ||    ||    ||   ||||  ||||   ||  || || ||");
//   console.log("  ||   ||  || ||  ||    ||    ||  ||  || || ||  ||  || || ||");
//   console.log("  ||    ||||  ||  ||    || || ||   ||||  ||  || ||          ");
//   console.log("  ||     ||     ||       ||||||     ||   ||   ||||  || || ||");
//   console.log("");
// }

// function printTie() {
//   console.log("");
//   console.log("      |||      ||||||||  ||  ||||||   || || ||");
//   console.log("     || ||        ||     ||  ||       || || ||");
//   console.log("    ||   ||       ||     ||  |||      || || ||");
//   console.log("    |||||||       ||     ||  ||               ");
//   console.log("   ||     ||      ||     ||  ||||||   || || ||");
//   console.log("");
// }

// //

// function computerChooseSquareHard(board, game, winCombination, validSquares) {
//   let computerChoice = undefined;
//   if (game.takenSquares <= 2) {
//     let strategicSquares = ['a1', 'a3', 'b2', 'c1', 'c3'];
//     computerChoice = randomChooseBetween(strategicSquares);
//     while (!checkIfEmpty(computerChoice, board)) {
//       computerChoice = randomChooseBetween(strategicSquares);
//     }
//   } else if (game.takenSquares >= 3) {
//     computerChoice = computerOffense(board, validSquares);
//     if (!computerChoice) {
//       computerDeffense(board, validSquares)
//     } else {
//       computerChoice = randomChooseBetween(strategicSquares);
//       while (!checkIfEmpty(computerChoice, board)) {
//         computerChoice = randomChooseBetween(strategicSquares);
//       }
//     }
//   }
// }

// function computerOffense(board, validSquares) {
//   let computerChoice;
//   //loop through winningcombination
//   //compare it to the current board
//   //check if
//   computerChoice = randomChooseBetween(validSquares);
//   while (!checkIfEmpty(computerChoice, board)) {
//     computerChoice = randomChooseBetween(validSquares);
//   }
//   console.log('computer offense');
//   return computerChoice;
// }

// function computerDeffense(board, validSquares) {
//   let computerChoice;
//   //loop through winningcombination
//   //compare it to the current board
//   //check if
//   computerChoice = randomChooseBetween(validSquares);
//   while (!checkIfEmpty(computerChoice, board)) {
//     computerChoice = randomChooseBetween(validSquares);
//   }
//   console.log('computer defense');
//   return computerChoice;
// }


// function computerChooseSquareExtreme(board, game) {
//   console.log('computer move extreme');
// }


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

