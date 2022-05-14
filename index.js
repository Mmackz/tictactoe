(function () {
   const squares = document.querySelectorAll(".container div");
   const startForm = document.querySelector(".form");
   const startScreen = document.querySelector(".start-screen");

   const Player = (name, marker, ai = false) => {
      const moves = [];
      const addMove = (move) => {
         moves.push(move);
      };
      return {
         name,
         marker,
         moves,
         addMove,
         ai
      };
   }

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
      };

      const resetBoard = () => {
         squares.forEach((square) => square.classList = "");
      };

      const resetGame = () => {
         resetBoard();
         gameStarted = false;
         players.length = 0;
         board.fill("");
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
      };

      const endGame = (winner) => {
         resetGame();
         startScreen.classList.remove("hide");
         document.getElementById("main").classList.add("hide");
      };

      const makeAiMove = (marker) => {
         if (!gameStarted) return;
         aiTurn = true;
         setTimeout(() => {
            const cpuMove = getRandomMove(getFreeSpaces());
            players[currentPlayer].addMove(cpuMove.toString());
            updateBoard(cpuMove, marker);
            aiTurn = false;
            checkForWinner(players[1]);
            changeTurn();    
         }, 1000);
      };

      const getGameState = () => {
         return gameStarted;
      };

      const getFreeSpaces = () => {
         return board.map((space, index) => {
            if (space === "") {
               return index;
            }
            return null;
         }).filter((space) => space !== null);
      };

      const getRandomMove = (moves) => moves[Math.floor(Math.random() * moves.length)];

      const startGame = (e) => {
         e.preventDefault();
         gameStarted = true;
         resetBoard();
         showBoard();
         assignPlayers(e.target.elements[0], e.target.elements[1], e.target.elements[2].checked);

         // set current player based on assignment of x and o
         currentPlayer = players[0].marker === "x" ? 0 : 1;

         // if cpu is first, set their move
         if (players[1].ai && players[1].marker === "x") {
            makeAiMove(players[1].marker);
         }
      }

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
            if (winningCombos[i].every((index) => player.moves.includes(index.toString()))) {
               console.log("winner found");
               markWinner(winningCombos[i]);
               gameStarted = false;
            }
         }
      }

      const takeTurn = (index) => {
         if (board[index] === "") {
            players[currentPlayer].addMove(index);
            updateBoard(index, players[currentPlayer].marker);
            board[index] = players[currentPlayer].marker;
            changeTurn();
         }
      }

      const markWinner = (winningCombo) => {
         squares.forEach((square, i) => {
            if (winningCombo.includes(i.toString())) {
               square.classList.add("winner");
               setTimeout(() => {
                  endGame();
               }, 5000);
            }
         })
      };

      const playRound = (index) => {

         // return if not players turn
         if (aiTurn) return;

         // return if space selected is not free
         if (board[index]) return;

         // add player move to board
         takeTurn(index);

         // check for winner
         checkForWinner(players[Math.abs(currentPlayer - 1)]);

         if (players[currentPlayer].ai) {
            makeAiMove(players[currentPlayer].marker);
         }; 
      }

      return {
         getGameState,
         startGame,
         playRound
      }
   })();

   const { startGame, playRound, getGameState } = GameController;

   startForm.addEventListener("submit", startGame);
   squares.forEach((square) => square.addEventListener("click", () => {
      if (getGameState()) {
         playRound(square.dataset.index);
      }   
   }));

})();




/* 
notes
-----

  - O is to small
  - use lowercase letters for markers
  - add delay before computer moves
  - have cpu go after player turn
  - if round reaches 9, declare draw
  
  left off adding turns for cpu on start (if selected randomly) and allowing player to fill boxes when game started
 */

   //    // winning conditions
   //    const winningAxes = [
   //       [0,1,2],
   //       [3,4,5],
   //       [6,7,8],
   //       [0,3,6],
   //       [1,4,7],
   //       [2,5,8],
   //       [0,4,8],
   //       [2,4,6],
   //   ];