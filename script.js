
// Step 1: Gameboard Module
const Gameboard = (() => {
    let board = Array(9).fill("");
  
    const getBoard = () => [...board]; // return a copy
  
    const updateCell = (index, marker) => {
      if (board[index] === "") {
        board[index] = marker;
        return true;
      }
      return false;
    };
  
    const resetBoard = () => {
      board = Array(9).fill("");
    };
  
    const printBoard = () => {
      console.log(
        `
        ${board[0] || " "} | ${board[1] || " "} | ${board[2] || " "}
       ---+---+---
        ${board[3] || " "} | ${board[4] || " "} | ${board[5] || " "}
       ---+---+---
        ${board[6] || " "} | ${board[7] || " "} | ${board[8] || " "}
        `
      );
    };
  
    return { getBoard, updateCell, resetBoard, printBoard };
  })();
  
//   Step 2: Player Factory

const Player = (name, marker) => {
    return { name, marker };
  };

// Game Controller

const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;

    const winningCombos = [
        [0,1,2],[3,4,5],[6,7,8], // rows
        [0,3,6],[1,4,7],[2,5,8], // columns
        [0,4,8],[2,4,6]          // diagonals
    ];

    const playRound = (index) => {
        if (gameOver) {
            console.log("Game is already over.");
            return; 
        }

        const success = Gameboard.updateCell(index, currentPlayer.marker)

        if (!success) {
            console.log("Invalid move. Cell is taken.");
            return;       
        }

        Gameboard.printBoard();

        if (checkWinner(currentPlayer.marker)) {
            console.log(`${currentPlayer.name} wins!`);
            gameOver = true;
            return;
          }

          if (Gameboard.getBoard().every(cell => cell !== "")) {
            console.log("It's a tie!");
            gameOver = true;
            return;
          }
          switchPlayer();
        console.log(`Next turn: ${currentPlayer.name}`);
    };
    const checkWinner = (marker) => {
        const board = Gameboard.getBoard();
        return winningCombos.some(combo =>
          combo.every(index => board[index] === marker)
        );
      };

      const switchPlayer = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
      };
      const restart = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
        console.log("Game restarted.");
        Gameboard.printBoard();
      };

      return { playRound, restart };
})();