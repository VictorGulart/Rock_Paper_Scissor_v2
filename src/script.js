// game mode options -> com and player
// match mode options -> bo1, bo3, bo5
const PVP_GAME = "pvp";
const COM_GAME = "com";

let match;
const BO1_MATCH = "bo1";
const BO3_MATCH = "bo3";
const BO5_MATCH = "bo5";

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
let result_log = document.querySelector("#result-log");
let bo1 = document.querySelector("#bo1");
let bo3 = document.querySelector("#bo3");
let bo5 = document.querySelector("#bo5");

// Helper functions

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1));
};

class Game {
  roundWinner = undefined;
  constructor(gameMode, matchMode, p1, p2) {
    this.matchWinner = "";
    this.running = true;
    this.modes = {
      game: gameMode,
      match: matchMode,
      currentMatch: bo1,
    };
    this.p1 = p1;
    this.p2 = p2;
    this.turn = 0; // 0 or 1
    this.setGameMode();
    this.setMatchMode();
  }

  setGameMode = () => {
    if (this.modes.game === COM_GAME) {
      this.showComGame();
      this.hidePVPGame();
    } else {
      this.hideComGame();
      this.showPVPGame();
    }
  };

  setMatchMode = () => {
    this.modes.currentMatch.classList.remove("active");
    switch (this.modes.match) {
      case "bo1":
        this.target = 1;
        this.roundCounter = 1;
        bo1.classList.add("active");
        this.modes.currentMatch = bo1;
        break;
      case "bo3":
        this.target = 2;
        this.roundCounter = 3;
        bo3.classList.add("active");
        this.modes.currentMatch = bo3;
        break;

      case "bo5":
        this.target = 3;
        this.roundCounter = 5;
        bo5.classList.add("active");
        this.modes.currentMatch = bo5;
        break;
    }
  };

  changeMatchMode = (event, newMode) => {
    // Pass new mode
    this.modes = {
      ...this.modes,
      match: newMode,
    };
    this.setMatchMode();
    this.resetMatch();
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
    this.matchWinner = undefined;
    this.roundWinner = undefined;
    this.running = true;
    this.resetResultLog();
    this.updateUI();
  };

  resetRound = () => {
    match.roundWinner = undefined;
    match.p1.resetChoice();
    match.p2.resetChoice();
  };

  changeGameMode = (e) => {
    //  Can be - p1 vs p2 -  or  - p1 vs com -
    // reset the game and change settings
  };

  showComGame = () => {
    // set up
    vsCom.classList.remove("hidden");
  };

  hideComGame = () => {
    vsCom.classList.add("hidden");
  };

  playCOM = (e) => {
    // Stop the action if game is not running
    if (!this.running) return;

    // Game Logic
    this.comGame(e.target.id);

    // UPDATE UI
    this.updateUI();

    // UPDATE LOGS
    this.updateLogs();
  };

  comGame = (playerChoice) => {
    // do the comGame setup

    // get player choice
    match.p1.playerPlay(playerChoice);

    // get com choice
    match.p2.comPlay();

    // Check round and match
    // match.roundWinner = match.checkRound();
    match.checkRound();
    match.checkMatch();
  };

  // PVP GAME
  showPVPGame = () => {};
  hidePVPGame = () => {};
  playPVP = () => {};
  pvpGame = () => {};

  updateUI = () => {
    p1_counter.innerHTML = match.p1.points;
    p2_counter.innerHTML = match.p2.points;
  };

  updateLogs = () => {
    // Update logs

    if (this.matchWinner) {
      //  if true then it ended and this.winner is set up.
      //  show on the modal the winner
      let res = document.createElement("div");
      res.innerHTML = `\nMatch winner is: ${this.matchWinner}`;
      result_log.appendChild(res);
      this.running = false;
      return;
    } else if (this.roundWinner !== "tie") {
      // record round winner
      let res = document.createElement("div");
      res.innerHTML = `\nRound winner is ${this.roundWinner.username}`;
      result_log.appendChild(res);
    } else if (this.roundWinner === "tie") {
      let res = document.createElement("div");
      res.innerHTML = "\nIt was a tie. Go Again!";
      result_log.appendChild(res);
    }
  };

  resetResultLog = () => {
    result_log.innerHTML = "";
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

const closeModal = () => {
  document.querySelector(".modal-result").classList.add("hidden");

  if (!match.running) {
    match.resetMatch();
    updateUI();
  }
};

// SetUp Default
match = new Game("com", "bo3", new Player("P1"), new Player("COM"));
