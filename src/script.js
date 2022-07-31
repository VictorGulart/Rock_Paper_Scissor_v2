/**
 * NOTES
 *
 * fix - hide the result_log when resetting the game
 *
 */

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
let game_field = document.querySelector(".game-field");
let call_action_text = document.querySelector("#call-text");
let p1_counter = document.querySelector("#p1-counter");
let p2_counter = document.querySelector("#p2-counter");
let modal_info = document.querySelector(".modal-info");
let result_board = document.querySelector("#result-board");
let result_log = document.querySelector("#result-log");
let bo1 = document.querySelector("#bo1");
let bo3 = document.querySelector("#bo3");
let bo5 = document.querySelector("#bo5");

// DOM Game Mode
let pvpModeDOM = document.querySelector("#pvp");
let comModeDOM = document.querySelector("#com");

// DOM ROCK PAPER SCISSORS
let rockDOM = document.querySelector("#rock");
let paperDOM = document.querySelector("#paper");
let scissorsDOM = document.querySelector("#scissors");

// Helper functions
const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1));
};

class Game {
  roundWinner = "";
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
    this.log_timeout;
  }

  setGameMode = () => {
    if (this.modes.game === COM_GAME) {
      this.setCOMMode();
      comModeDOM.onclick = "";
      comModeDOM.classList.add("active");
      pvpModeDOM.onclick = () => this.changeGameMode("pvp");
      pvpModeDOM.classList.remove("active");
      this.p2.username = "COM";
    } else {
      this.setPvPMode();
      pvpModeDOM.onclick = "";
      pvpModeDOM.classList.add("active");
      comModeDOM.onclick = () => this.changeGameMode("com");
      comModeDOM.classList.remove("active");
      this.p2.username = "P2";
    }
  };

  setCOMMode = () => {
    // Change onclick listeners
    rockDOM.onclick = () => this.playCOM("rock");
    paperDOM.onclick = () => this.playCOM("paper");
    scissorsDOM.onclick = () => this.playCOM("scissors");
  };

  setPvPMode = () => {
    // Change onclick listeners
    rockDOM.onclick = () => this.playPVP("rock");
    paperDOM.onclick = () => this.playPVP("paper");
    scissorsDOM.onclick = () => this.playPVP("scissors");
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

  changeGameMode = (mode) => {
    console.log(mode);
    if (mode === COM_GAME) this.modes.game = mode;
    else if (mode === PVP_GAME) this.modes.game = mode;
    else console.log("this mode does not exist");

    this.setGameMode();
    this.setMatchMode();
    this.resetMatch();
  };

  changeMatchMode = (newMode) => {
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
    // console.log(this.roundCounter, this.target);

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
    this.p1.newMatch();
    this.p2.newMatch();
    this.matchWinner = "";
    this.roundWinner = "";
    this.running = true;
    this.turn = 0;
    this.resetResultLog();
    this.updateUI();
  };

  resetRound = () => {
    match.roundWinner = "";
    match.p1.resetChoice();
    match.p2.resetChoice();
  };

  // COM GAME
  playCOM = (choice) => {
    /**
     * Receives the click from the user
     */
    // Stop the action if game is not running
    if (!this.running) return;

    // Game Logic
    this.comGame(choice);

    // UPDATE UI
    this.updateUI();

    // UPDATE LOGS
    this.updateLogs();

    this.resetRound();
  };

  comGame = (playerChoice) => {
    /**
     * This represents a round of a match against the machine
     */

    // get player choice
    this.p1.playerPlay(playerChoice);

    // get com choice
    this.p2.comPlay();

    // Check round and match
    // match.roundWinner = match.checkRound();
    this.checkRound();
    this.checkMatch();
  };

  // PVP GAME
  playPVP = (choice) => {
    // Stop the action if game is not running
    if (!this.running) return;

    // Game Logic
    this.pvpGame(choice);

    // UPDATE UI
    this.updateUI();

    if (this.roundWinner !== "" || this.matchWinner !== "") {
      // only update after both have choosen something
      // UPDATE LOGS
      this.updateLogs();
      this.resetRound();
    }
  };

  pvpGame = (choice) => {
    console.log(this.roundCounter, this.turn, this.p1.choice, this.p2.choice);
    // check whos turn is
    if (this.p1.choice === "") {
      console.log("p1 choice is ", choice);
      this.p1.choice = choice;
      this.turn = 1;
      return;
    } else {
      console.log("p2 choice is ", choice);
      this.p2.choice = choice;
      this.turn = 0;
    }

    if (this.p1.choice !== "" && this.p2.choice) {
      // both players have a choice
      // Check Rounds and Match
      this.checkRound();
      this.checkMatch();
    }
  };

  updateUI = () => {
    p1_counter.innerHTML = this.p1.points;
    p2_counter.innerHTML = this.p2.points;

    if (this.modes.game === PVP_GAME && this.turn === 0) {
      // check turn and update info text
      call_action_text.innerHTML = "What's you move P1";
    } else if (this.modes.game === PVP_GAME && this.turn === 1) {
      call_action_text.innerHTML = "What's you move P2";
    } else {
      call_action_text.innerHTML = "What's you move P1?";
    }
  };

  updateLogs = () => {
    // Update logs

    if (this.matchWinner) {
      //  if true then it ended and this.winner is set up.
      //  show on the modal the winner
      let res = document.createElement("div");
      res.innerHTML = `\nMatch winner is: ${this.matchWinner}`;
      result_log.innerHTML = "";
      result_log.appendChild(res);
      this.running = false;

      window.clearTimeout(this.log_timeout);
      result_log.classList.remove("hide-down");

      return;
    } else if (this.roundWinner !== "tie") {
      // record round winner
      let res = document.createElement("div");
      res.innerHTML = `\nRound winner is ${this.roundWinner.username}`;
      result_log.innerHTML = "";
      result_log.appendChild(res);
    } else if (this.roundWinner === "tie") {
      let res = document.createElement("div");
      result_log.innerHTML = "";
      res.innerHTML = "\nIt was a tie. Go Again!";
      result_log.appendChild(res);
    }

    if (!result_log.classList.contains("hide-down")) {
      // if it is still visible then reset the timeout
      window.clearTimeout(this.log_timeout);
    } else {
      result_log.classList.remove("hide-down");
    }

    this.log_timeout = setTimeout(() => {
      result_log.classList.add("hide-down");
    }, 3000);
  };

  resetResultLog = () => {
    result_log.classList.add("hide-down");
    setTimeout(() => {
      result_log.innerHTML = "";
    }, 500);
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

  newMatch() {
    this.points = 0;
    this.choice = "";
  }
}

document.addEventListener("keydown", (e) => {
  // Handle keydowns
  let game = match.modes.game === PVP_GAME ? match.playPVP : match.playCOM;

  switch (e.key) {
    case "a":
      game("rock");
      break;
    case "s":
      game("paper");
      break;
    case "d":
      game("scissors");
      break;

    case "j":
      match.modes.game === PVP_GAME ? game("rock") : null;
    case "k":
      match.modes.game === PVP_GAME ? game("paper") : null;
      break;
    case "l":
      match.modes.game === PVP_GAME ? game("scissors") : null;
      break;
    case "r":
      match.resetMatch();
  }
});

const closeModal = () => {
  modal_info.classList.add("hidden");
};

const showModal = () => {
  modal_info.classList.remove("hidden");
};

// SetUp Default
match = new Game("com", "bo3", new Player("P1"), new Player("COM"));
