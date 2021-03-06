import minimax from "./modules/minimax.js";
import { Player } from "./modules/player.js";

(function () {
   // DOM elements
   const squares = document.querySelectorAll(".container div");
   const startForm = document.querySelector(".form");
   const startScreen = document.querySelector(".start-screen");
   const outcomeScreen = document.getElementById("outcome");
   const player1info = document.getElementById("p1");
   const player2info = document.getElementById("p2");
   const isAI = document.getElementById("isAI");
   const root = document.querySelector(':root');
   const easyMode = document.getElementById("easy-checkbox");

   const GameController = (() => {
      let gameStarted = false;
      let aiTurn = false;
      let currentPlayer = 0;
      const players = [];
      const board = new Array(9).fill("");

      const assignPlayers = (player1, player2, ai) => {
         const bool = Math.random() > 0.5;
         players.push(Player(player1.value, bool ? "x" : "o"));
         players.push(Player(player2.value, bool ? "o" : "x", ai));
         const p1 = players[0].marker === "x" ? players[0] : players[1];
         const p2 = players[0].marker === "x" ? players[1] : players[0];
         player1info.innerHTML = `${p1.name} <span class="emoji">${
            p1.ai ? "🤖" : ""
         }</span>`;
         player2info.innerHTML = `${p2.name} <span class="emoji">${
            p2.ai ? "🤖" : ""
         }</span>`;
         player1info.parentElement.classList = "player-info active";
         player2info.parentElement.classList = "player-info";
      };

      const resetBoard = () => {
         squares.forEach((square) => (square.classList = ""));
      };

      const resetGame = () => {
         resetBoard();
         gameStarted = false;
         players.length = 0;
         board.fill("");
         startScreen.classList.remove("hide");
         document.getElementById("main").classList.add("hide");
         outcomeScreen.classList.add("hide");
      };

      const updateBoard = (index, marker) => {
         squares[index].classList.add(marker);
         board[index] = marker;
      };

      const showBoard = () => {
         startScreen.classList.add("hide");
         document.getElementById("main").classList.remove("hide");
      };

      const changeTurn = () => {
         currentPlayer = currentPlayer ? 0 : 1;
         if (gameStarted) {
            if (
               (players[0].marker === "x" && currentPlayer === 0) ||
               (players[0].marker === "o" && currentPlayer === 1)
            ) {
               player1info.parentElement.classList = "player-info active";
               player2info.parentElement.classList = "player-info";
               root.style.setProperty("--player", "#ebf18f");
            } else {
               player1info.parentElement.classList = "player-info";
               player2info.parentElement.classList = "player-info active";
               root.style.setProperty("--player", "#ff6583");
            }
         }
      };

      const endGame = (winner) => {
         gameStarted = false;
         let outcome;

         if (winner === "tie") {
            outcome = "The game ended in a draw!";
         } else {
            outcome = `${winner.name} has won!`;
         }

         outcomeScreen.textContent = outcome;
         outcomeScreen.classList.remove("hide");

         const timerID = setTimeout(resetGame, 7500);

         outcomeScreen.addEventListener("click", () => {
            clearTimeout(timerID);
            resetGame();
         });
      };

      const getFreeSpaces = () => {
         return board
            .map((space, index) => {
               if (space === "") {
                  return index;
               }
               return null;
            })
            .filter((space) => space !== null);
      };

      const getRandomMove = (moves) => moves[Math.floor(Math.random() * moves.length)];

      const makeAiMove = (marker) => {
         // use minimax to find best move
         if (!gameStarted) return;
         aiListener.turn = true;
         setTimeout(() => {
            let cpuMove;
            // leave chance for a.i to make early mistake if easy mode selected
            if (
               (easyMode.checked &&
                  Math.random() < 0.6 &&
                  board.filter(Boolean).length < 3) ||
               (easyMode.checked &&
                  Math.random() < 0.1 &&
                  board.filter(Boolean).length >= 3)
            ) {
               cpuMove = getRandomMove(getFreeSpaces());
            } else {
               cpuMove = minimax.findBestMove(board, marker);
            }
            players[currentPlayer].addMove(cpuMove.toString());
            updateBoard(cpuMove, marker);
            aiListener.turn = false;
            checkForWinner(players[currentPlayer]);
            changeTurn();
         }, 1200);
      };

      const getGameState = () => {
         return {
            gameStarted,
            aiTurn,
            currentPlayer: players[currentPlayer]
         };
      };

      const startGame = (e) => {
         e.preventDefault();
         gameStarted = true;
         resetBoard();
         showBoard();
         assignPlayers(
            e.target.elements[0],
            e.target.elements[1],
            e.target.elements[2].checked
         );

         // set current player based on assignment of x and o
         currentPlayer = players[0].marker === "x" ? 0 : 1;

         // if cpu is first, set their move
         if (players[1].ai && players[1].marker === "x") {
            makeAiMove(players[1].marker);
         }
      };

      const checkForWinner = (player) => {
         // no need to check for winner if less than 5 moves
         if (board.filter(Boolean).length < 5) return;
         const winningCombos = [
            ["0", "1", "2"],
            ["3", "4", "5"],
            ["6", "7", "8"],
            ["0", "3", "6"],
            ["1", "4", "7"],
            ["2", "5", "8"],
            ["0", "4", "8"],
            ["2", "4", "6"]
         ];

         for (let i = 0; i < winningCombos.length; i++) {
            if (
               winningCombos[i].every((index) => player.moves.includes(index.toString()))
            ) {
               markWinner(winningCombos[i]);
               endGame(player);
            }
         }

         // check for tie
         if (board.filter(Boolean).length === 9 && gameStarted) {
            endGame("tie");
         }
      };

      const takeTurn = (index) => {
         if (board[index] === "") {
            players[currentPlayer].addMove(index);
            updateBoard(index, players[currentPlayer].marker);
            board[index] = players[currentPlayer].marker;
         }
      };

      const markWinner = (winningCombo) => {
         squares.forEach((square, i) => {
            if (winningCombo.includes(i.toString())) {
               square.classList.add("winner");
            }
         });
      };

      const playRound = (index) => {
         // return if not players turn
         if (aiTurn) return;

         // return if space selected is not free
         if (board[index]) return;

         // add player move to board
         takeTurn(index);

         // check for winner
         checkForWinner(players[currentPlayer]);

         // change turn
         changeTurn();

         if (gameStarted && players[currentPlayer].ai) {
            makeAiMove(players[currentPlayer].marker);
         }
      };

      const aiListener = {
         listener: function(value) {},
         set turn(value) {
            aiTurn = value;
            this.listener(value);
         },
         get turn() {
            return aiTurn;
         },
         registerListener: function(listener) {
            this.listener = listener;
         }
      };

      return {
         aiListener,
         getGameState,
         startGame,
         playRound
      };
   })();

   const { aiListener, startGame, playRound, getGameState } = GameController;

   startForm.addEventListener("submit", startGame);
   squares.forEach((square) => {
      square.addEventListener("click", () => {
         if (getGameState().gameStarted) {
            playRound(square.dataset.index);
         }
      });
   });

   // allows hover effects to only be active on players turn
   aiListener.registerListener(() => {
      squares.forEach((square) => {
         setTimeout(() => {
            if (getGameState().gameStarted) square.classList.toggle("aiturn");
         }, 0);
      });
   });

   isAI.addEventListener("change", () => {
      document.querySelector(".difficulty").classList.toggle("hide");
   });
})();
