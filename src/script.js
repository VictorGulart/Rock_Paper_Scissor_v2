// game mode options -> com and player
// match mode options -> bo1, bo3, bo5
let gameMode = "com";
const PVP = "pvp";
const COM = "com";

let match;
const BO1 = "bo1";
const BO3 = "bo3";
const BO5 = "bo5";

const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";

const TIE = "tie";

// DOM Objects
let vsCom = document.querySelector(".vs-com");
let vsPlayer = document.querySelector("#vs-p");
let p1_counter = document.querySelector("#p1-counter");
let p2_counter = document.querySelector("#p2-counter");
let modal_result = document.querySelector(".modal-result");
let result_board = document.querySelector("#result-board");

// Helper functions

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1));
};

class Match {
  roundWinner = undefined;
  constructor(gameMode, matchMode, p1, p2) {
    this.matchWinner = "";
    this.running = true;
    this.gameMode = gameMode;
    this.matchMode = matchMode;
    this.p1 = p1;
    this.p2 = p2;
    this.turn = 0; // 0 or 1
    this.setUpMatchMode();
  }

  setUpMatchMode = () => {
    switch (this.matchMode) {
      case "bo1":
        this.target = 1;
        this.roundCounter = 1;
        break;
      case "bo3":
        this.target = 2;
        this.roundCounter = 3;
        break;

      case "bo5":
        this.target = 3;
        this.roundCounter = 5;
        break;
    }
  };

  decCounter = () => {
    // Checks if there are more rounds to go
    this.roundCounter = this.roundCounter - 1;
  };

  checkMatch = () => {
    /**
     * Check if there's a winner
     * return true or false
     */
    console.log(this.roundCounter, this.target);

    if (this.p1.points === this.target) {
      this.matchWinner = `${this.p1.username}`;
    } else if (this.p2.points === this.target) {
      this.matchWinner = `${this.p2.username}`;
    }
  };

  checkRound = () => {
    // Check the round winner
    switch (this.p1.choice) {
      case ROCK:
        if (this.p2.choice === PAPER) {
          this.roundWinner = this.p2;
        } else if (this.p2.choice === SCISSORS) {
          this.roundWinner = this.p1;
        }
        break;
      case PAPER:
        if (this.p2.choice === SCISSORS) {
          this.roundWinner = this.p2;
        } else if (this.p2.choice === ROCK) {
          this.roundWinner = this.p1;
        }
        break;
      case SCISSORS:
        if (this.p2.choice === ROCK) {
          this.roundWinner = this.p2;
        } else if (this.p2.choice === PAPER) {
          this.roundWinner = this.p1;
        }
        break;
    }

    if (this.p1.choice === this.p2.choice) {
      this.roundWinner = "tie";
      return; // go again
    }

    this.roundWinner.incPoints();
    this.decCounter();
  };

  resetMatch = () => {
    /**
     * Resetting the match
     */
    this.p1.newGameReset();
    this.p2.newGameReset();
    this.setUpMatchMode();
    this.matchWinner = undefined;
    this.roundWinner = undefined;
    this.running = true;
  };

  resetRound = () => {
    match.roundWinner = undefined;
    match.p1.resetChoice();
    match.p2.resetChoice();
  };
}

class Player {
  constructor(username) {
    this.username = username;
    this.points = 0;
  }

  incPoints() {
    this.points += 1;
  }

  comPlay() {
    // Return a random play
    let options = ["rock", "paper", "scissors"];
    let choice = getRandom(0, 2);
    this.choice = options[choice];
  }

  playerPlay(choice) {
    // Set up the choice
    this.choice = choice;
  }

  resetChoice() {
    // Resets the variable
    this.choice = "";
  }

  newGameReset() {
    this.points = 0;
    this.choice = "";
  }
}

const comGameSetUp = () => {
  // set up
  vsCom.classList.remove("hidden");
};

const changeGameMode = (e) => {
  //  Can be - p1 vs p2 -  or  - p1 vs com -
  // reset the game and change settings
};

const changeMatchMode = (e) => {
  //  Can be - single round, best of 3 or 5
  // reset the current game
};

const comGame = (playerChoice) => {
  // get player choice
  match.p1.playerPlay(playerChoice);

  // get com choice
  match.p2.comPlay();

  // Check round and match
  // match.roundWinner = match.checkRound();
  match.checkRound();
  match.checkMatch();

  // check if there's a winner
  if (match.matchWinner) {
    //  if true then it ended and this.winner is set up.
    //  show on the modal the winner
    console.log("Match winner is ->", match.matchWinner);
    match.running = false;
    return;
  } else if (match.roundWinner !== "tie") {
    // record round winner
    console.log("Round winner is ->", match.roundWinner.username);
  } else if (match.roundWinner === "tie") {
    console.log("It was a tie. Go Again!");
  }

  // reset players choices
  match.resetRound();
};

const updateUI = () => {
  p1_counter.innerHTML = match.p1.points;
  p2_counter.innerHTML = match.p2.points;
};

const play = (e) => {
  // check whos turn is it and game-mode

  if (match.gameMode === COM) {
    comGame(e.target.id);
  }

  // UPDATE UI
  // update rounds
  updateUI();

  if (match.running && match.roundWinner === TIE) {
    result_board.innerHTML = `It's a tie. Go again!`;
    modal_result.classList.remove("hidden");
  }
  if (!match.running) {
    // SHOW THE
    result_board.innerHTML = `The winner is ${match.matchWinner}`;
    modal_result.classList.remove("hidden");
    console.log("END OF MATCH");
  }
};

const closeModal = () => {
  document.querySelector(".modal-result").classList.add("hidden");

  if (!match.running) {
    match.resetMatch();
    updateUI();
  }
};

// RUN

(function run() {
  // SetUp Default
  match = new Match("com", "bo3", new Player("P1"), new Player("COM"));
  comGameSetUp();
})();
