const squares = document.querySelectorAll(".container div");
const startBtn = document.querySelector("#start");

(function () {
   let gameActive = false;
   let round = 0;
   let currentTurn = null;
   const player = Player("player", "X");
   const computer = Player("computer", "O");

   const GameController = (function () {
      const selectFirstToGo = () => {
         const random = Math.floor(Math.random() * 2);
         return random ? "X" : "O";
      };
      const runTurn = (p, i) => {
         if (gameActive) {
            const occupiedSquares = player.moves.concat(computer.moves);
            if (!occupiedSquares.includes(i)) {
               p.addMove(i);
               return true;
            }
            return false;
         }
      };
      return {
         selectFirstToGo,
         runTurn
      };
   })();

   startBtn.onclick = function () {
      gameActive = !gameActive;
      currentTurn = GameController.selectFirstToGo();
      if (computer.marker === currentTurn) {
         const randNum = Math.floor(Math.random() * 9);
         GameController.runTurn(computer, randNum);
         squares[randNum].classList.add(computer.marker.toLowerCase());
      }
      console.log(gameActive);
   };

   squares.forEach((square, i) => {
      square.onclick = function () {
         if (GameController.runTurn(player, i)) {
            this.classList.add(player.marker.toLowerCase());
         }
      };
   });
})();

function Player(name, marker) {
   const moves = [];
   const addMove = (move) => {
      moves.push(move);
   };
   return {
      name,
      marker,
      moves,
      addMove
   };
}

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