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
};

export { Player };