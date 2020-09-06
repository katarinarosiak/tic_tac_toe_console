const readline = require('readline-sync');
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
  game.currentPlayer.points++;
}


function announceGameStatus(message, playerObj, name) {
  print(message, name);
  console.log(`=> Player 1 has ${playerObj.player1.points} points and Player 2 has ${playerObj.player2.points} points`);
}

function changeTurn(game, messages, players) {
  if (game.currentPlayer.id === 'player1') {
    game.currentPlayer = players.player2;
  } else {
    game.currentPlayer = players.player1;
  }
  print(messages.YourTurn, game.currentPlayer.name);
}


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

function computerChooseSquareHard(game, winCombination, sign) {
  let computerChoice = "";
  let strategicSquares = ['a1', 'a3', 'b2', 'c1', 'c3'];

  if (game.takenSquares <= 2) {
    computerChoice = computerRandomMove(strategicSquares, game, sign);

  } else if (game.takenSquares >= 3) {
    computerChoice = computerOffend(game, sign, winCombination);

    if (!computerChoice) {
      computerChoice = computerDeffend(game, sign, winCombination);
      if (!computerChoice) {
        computerChoice = computerRandomMove(strategicSquares, game, sign);
      }
    }
  }

  return computerChoice;
}

function computerRandomMove(strategicSquares, game, sign) {
  let computerChoice = randomChooseBetween(strategicSquares);
  while (!checkIfEmpty(computerChoice, game, sign)) {
    computerChoice = randomChooseBetween(strategicSquares);
  }
  return computerChoice;
}



function computerOffend(game, sign, winCombination) {
  let computerChoice;

  for (let line = 0; line < winCombination.length; line++) {
    let [sq1, sq2, sq3] = winCombination[line];


    if (
      game.gameBoard[sq1] === game.currentPlayer.chosenSign &&
      game.gameBoard[sq2] === game.currentPlayer.chosenSign &&
      game.gameBoard[sq3] === sign.initialMarker
    ) {

      computerChoice = sq3;
    } else if (
      game.gameBoard[sq1] === game.currentPlayer.chosenSign &&
      game.gameBoard[sq3] === game.currentPlayer.chosenSign &&
      game.gameBoard[sq2] === sign.initialMarker
    ) {

      computerChoice = sq2;
    } else if (
      game.gameBoard[sq2] === game.currentPlayer.chosenSign &&
      game.gameBoard[sq3] === game.currentPlayer.chosenSign &&
      game.gameBoard[sq1] === sign.initialMarker
    ) {

      computerChoice = sq1;
    }
  }
  return computerChoice;
}


function computerDeffend(game, sign, winCombination) {
  let computerChoice;
  let otherPlayerSign = returnOtherPlayerSign(sign, game.currentPlayer.chosenSign);


  for (let line = 0; line < winCombination.length; line++) {
    let [sq1, sq2, sq3] = winCombination[line];

    if (
      game.gameBoard[sq1] === otherPlayerSign &&
      game.gameBoard[sq2] === otherPlayerSign &&
      game.gameBoard[sq3] === sign.initialMarker
    ) {
      computerChoice = sq3;

    } else if (
      game.gameBoard[sq1] === otherPlayerSign &&
      game.gameBoard[sq3] === otherPlayerSign &&
      game.gameBoard[sq2] === sign.initialMarker
    ) {
      computerChoice = sq2;

    } else if (
      game.gameBoard[sq2] === otherPlayerSign &&
      game.gameBoard[sq3] === otherPlayerSign &&
      game.gameBoard[sq1] === sign.initialMarker

    ) {
      computerChoice = sq1;
    }
  }

  return computerChoice;
}


function returnOtherPlayerSign(sign, currentPlayerSign) {
  for (let key in sign) {
    if (sign[key] !== currentPlayerSign && sign[key] !== sign.initialMarker) {
      return sign[key];
    }
  }
}

function computerChooseSquareExtreme(game, sign, winCombination) {

  let bestScore = -Infinity;
  let bestMove;
  let maximizingPlayer = game.currentPlayer.chosenSign;
  let minimizingPlayer = returnOtherPlayerSign(sign, game.currentPlayer.chosenSign);

  for (let key in game.gameBoard) {

    if (game.gameBoard[key] === sign.initialMarker) {
      game.gameBoard[key] = game.currentPlayer.chosenSign;
      game.takenSquares++;
      let score = minimax(game, maximizingPlayer, 1, sign, winCombination, false, minimizingPlayer);

      game.gameBoard[key] = sign.initialMarker;
      game.takenSquares--;

      if (score > bestScore) {
        bestScore = score;
        bestMove = key;
      }
    }
  }
  return bestMove;
}


function minimax(game, maximizingPlayer, depth, sign, winCombination, isMaximizing, minimizingPlayer) {

  let valueOfMove = checkValueOfMove(game, maximizingPlayer, winCombination, minimizingPlayer);
  if (valueOfMove !== null) {
    return valueOfMove;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let key in game.gameBoard) {
      if (game.gameBoard[key] === sign.initialMarker) {
        game.gameBoard[key] = maximizingPlayer;
        game.takenSquares++;

        let score = minimax(game, maximizingPlayer, depth + 1, sign, winCombination, false, minimizingPlayer);

        game.gameBoard[key] = sign.initialMarker;
        game.takenSquares--;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;

  } else {
    let bestScore = Infinity;
    for (let key in game.gameBoard) {
      if (game.gameBoard[key] === sign.initialMarker) {
        game.gameBoard[key] = minimizingPlayer;
        game.takenSquares++;
        let score = minimax(game, maximizingPlayer, depth + 1, sign, winCombination, true, minimizingPlayer);
        game.gameBoard[key] = sign.initialMarker;
        game.takenSquares--;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}


function isWinning(game, winCombination, chosenSign) {
  for (let line = 0; line < winCombination.length; line++) {
    let [sq1, sq2, sq3] = winCombination[line];

    if (
      game.gameBoard[sq1] === chosenSign &&
      game.gameBoard[sq2] === chosenSign &&
      game.gameBoard[sq3] === chosenSign
    ) {
      return true;
    }
  }
  return false;
}


function checkValueOfMove(game, maximizingPlayer, winCombination, minimizingPlayer) {

  if (isWinning(game, winCombination, maximizingPlayer)) {
    return 10;
  } else if (isWinning(game, winCombination, minimizingPlayer)) {
    return -10;
  } else if (checkIfTie(game)) {
    return 0;
  } else {
    return null;
  }
}


function printCongratulation() {
  console.log('')
  console.log("||    ||    ||   ||     ||  || || ||");
  console.log("||    ||    ||   ||||   ||  || || ||");
  console.log("||    ||    ||   || ||  ||  || || ||");
  console.log("|| || ||    ||   ||  || ||          ");
  console.log(" ||||||     ||   ||   ||||  || || ||");
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
module.exports.computerOffense = computerOffend;
module.exports.computerDeffense = computerDeffend;
module.exports.computerChooseSquareExtreme = computerChooseSquareExtreme;
module.exports.returnOtherPlayerSign = returnOtherPlayerSign;
module.exports.minimax = minimax;
module.exports.checkValueOfMove = checkValueOfMove;
module.exports.isWinning = isWinning;

