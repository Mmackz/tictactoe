export default (function () {
   let maxPlayer;
   let minPlayer;

   function isMovesLeft(board) {
      return board.some((x) => !x);
   }

   function evaluate(board, max, depth) {
      const turn = max ? maxPlayer : minPlayer;

      // look for a winning combo
      if (
         (board[0] == turn && board[1] == turn && board[2] == turn) ||
         (board[3] == turn && board[4] == turn && board[5] == turn) ||
         (board[6] == turn && board[7] == turn && board[8] == turn) ||
         (board[0] == turn && board[3] == turn && board[6] == turn) ||
         (board[1] == turn && board[4] == turn && board[7] == turn) ||
         (board[2] == turn && board[5] == turn && board[8] == turn) ||
         (board[0] == turn && board[4] == turn && board[8] == turn) ||
         (board[2] == turn && board[4] == turn && board[6] == turn)
      ) {
         return max ? 10 - depth : -10 + depth;
      }

      // in case of tie
      return 0;
   }

   function minimax(board, depth, isMax) {
      const score = evaluate(board, !isMax, depth);

      if (score) return score;
      if (!isMovesLeft(board)) return 0;

      if (isMax) {
         let best = -Infinity;

         for (let i = 0; i < board.length; i++) {
            if (board[i] == "") {
               board[i] = maxPlayer;
               best = Math.max(best, minimax(board, depth + 1, !isMax));
               board[i] = "";
            }
         }
         return best;
      } else {
         let best = Infinity;
         for (let i = 0; i < board.length; i++) {
            if (board[i] == "") {
               board[i] = minPlayer;
               best = Math.min(best, minimax(board, depth + 1, !isMax));
               board[i] = "";
            }
         }
         return best;
      }
   }

   function findBestMove(board, marker) {
      let bestVal = -Infinity;
      let bestMove;

      maxPlayer = marker;
      minPlayer = marker == "x" ? "o" : "x";

      // if first move return random corner
      if (board.every((x) => x == "")) return [0, 2, 6, 8][Math.floor(Math.random() * 4)];

      for (let i = 0; i < board.length; i++) {
         if (board[i] == "") {
            board[i] = maxPlayer;

            const moveVal = minimax(board, 0, false);
            board[i] = "";

            if (moveVal > bestVal) {
               bestMove = i;
               bestVal = moveVal;
            }
         }
      }
      return bestMove;
   }

   return {
      findBestMove
   };
})();
