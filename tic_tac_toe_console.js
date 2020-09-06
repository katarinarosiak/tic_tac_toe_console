const readline = require('readline-sync');
const MESSAGES = require('./messages_tic_tac_toe.json');
const VALID_ANSWERS = require('./valid_answers.json');
const HELPERS = require('./helpers.js');

const SIGNS = {
  initialMarker: ' ',
  cross: 'X',
  circle: 'O'
}

const WIN_COMBINATION = [
  ['a1', 'a2', 'a3'], ['b1', 'b2', 'b3'], ['c1', 'c2', 'c3'],
  ['a1', 'b1', 'c1'], ['a2', 'b2', 'c2'], ['a3', 'b3', 'c3'],
  ['a1', 'b2', 'c3'], ['c1', 'b2', 'a3']
];

const PLAYERS = {
  player1: {
    id: 'player1',
    name: 'player1',
    human: true,
    chosenSign: SIGNS.cross,
    points: 0
  },
  player2: {
    id: 'player2',
    name: 'player2',
    human: false,
    chosenSign: SIGNS.circle,
    points: 0
  }
};

let gameStatus = {
  win: false,
  tie: false,
  takenSquares: 0,
  round: 1,
  level: 1,
  currentPlayer: PLAYERS.player1,
  gameBoard: {
    a1: SIGNS.initialMarker,
    a2: SIGNS.initialMarker,
    a3: SIGNS.initialMarker,
    b1: SIGNS.initialMarker,
    b2: SIGNS.initialMarker,
    b3: SIGNS.initialMarker,
    c1: SIGNS.initialMarker,
    c2: SIGNS.initialMarker,
    c3: SIGNS.initialMarker
  }
}


HELPERS.clearScreen();
HELPERS.print(MESSAGES.welcome, ' ');

gameStatus.currentPlayer.name = readline.question('What is your name?');

let playWith = HELPERS.retriveInput(MESSAGES.player, MESSAGES.playWithValidity, VALID_ANSWERS.validNums, gameStatus.currentPlayer.name);
HELPERS.updateWhoIsPlaying(playWith, PLAYERS.player2);

if (playWith === '1') {
  PLAYERS.player2.name = readline.question('What is your name of player 2?');
} else {
  gameStatus.level = HELPERS.retriveInput(MESSAGES.level, MESSAGES.levelValidity, VALID_ANSWERS.validLevel, gameStatus.currentPlayer.name);
}

let player1chosenSign = HELPERS.retriveInput(MESSAGES.chooseSign, MESSAGES.signValidity, VALID_ANSWERS.validSigns, gameStatus.currentPlayer.name);

HELPERS.assignSignsToPlayers(player1chosenSign, PLAYERS, SIGNS);
HELPERS.clearScreen();
HELPERS.printBoard(gameStatus.gameBoard);

while (!gameStatus.win || !gameStatus.tie) {

  let squareId = '';

  if (gameStatus.currentPlayer.human) {
    squareId = HELPERS.humanChooseSquare(MESSAGES, gameStatus.gameBoard, SIGNS.initialMarker, VALID_ANSWERS, gameStatus.currentPlayer.name);

  } else if (gameStatus.level === "1") {
    squareId = HELPERS.computerChooseSquareEasy(gameStatus, SIGNS);


  } else if (gameStatus.level === "2") {
    squareId = HELPERS.computerChooseSquareHard(gameStatus, WIN_COMBINATION, SIGNS);

  } else {
    squareId = HELPERS.computerChooseSquareExtreme(gameStatus, SIGNS, WIN_COMBINATION);
  }

  HELPERS.clearScreen();
  HELPERS.placeSignToBoard(MESSAGES, squareId, gameStatus, SIGNS);
  HELPERS.printBoard(gameStatus.gameBoard);


  gameStatus.win = HELPERS.checkIfWin(gameStatus, WIN_COMBINATION);
  if (gameStatus.win) {

    HELPERS.incrementPoints(gameStatus);
    HELPERS.printCongratulation();
    HELPERS.announceGameStatus(MESSAGES.congratulation, PLAYERS, gameStatus.currentPlayer.name);
  } else if (!gameStatus.win) {
    gameStatus.tie = HELPERS.checkIfTie(gameStatus);
    if (gameStatus.tie) {
      HELPERS.printTie();
      HELPERS.announceGameStatus(MESSAGES.tie, PLAYERS, gameStatus.currentPlayer.name)
    }
  }

  if (gameStatus.win || gameStatus.tie) {
    let playAgain = HELPERS.retriveInput(MESSAGES.playAgain, MESSAGES.invalidYesNo, VALID_ANSWERS.validAnswers, ' ');

    if (playAgain.toLowerCase().slice(0, 1) === 'y') {
      gameStatus.gameBoard = HELPERS.initializeGameBoard(3, SIGNS.initialMarker);
      HELPERS.restartGame(gameStatus, PLAYERS);

    } else {
      HELPERS.print(MESSAGES.thankYou, gameStatus.currentPlayer.name);
      return;
    }
  } else {
    HELPERS.changeTurn(gameStatus, MESSAGES, PLAYERS);
  }
}
