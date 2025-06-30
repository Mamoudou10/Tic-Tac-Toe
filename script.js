// Gameboard Module
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
  
  // Player Factory
  const Player = (name, marker) => {
    return { name, marker };
  };
  
  // Game Controller
  const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;
  
    const playRound = (index) => {
      if (gameOver) return;
  
      const success = Gameboard.updateCell(index, currentPlayer.marker);
      if (!success) return;
  
      if (checkWinner(currentPlayer.marker)) {
        DisplayController.showMessage(`${currentPlayer.name} wins!`);
        gameOver = true;
        DisplayController.render();
        return;
      }
  
      if (Gameboard.getBoard().every(cell => cell !== "")) {
        DisplayController.showMessage("It's a draw!");
        gameOver = true;
        DisplayController.render();
        return;
      }
  
      switchPlayer();
      DisplayController.showMessage(`Turn: ${currentPlayer.name}`);
      DisplayController.render();
    };
  
    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
  
    const checkWinner = (marker) => {
      const b = Gameboard.getBoard();
      const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
      ];
      return wins.some(combo => combo.every(i => b[i] === marker));
    };
  
    const restart = () => {
      Gameboard.resetBoard();
      currentPlayer = player1;
      gameOver = false;
      DisplayController.showMessage("Tic Tac Toe");
      DisplayController.render();
    };
  
    const isGameOver = () => gameOver;
    const getCurrentPlayer = () => currentPlayer;
  
    return { playRound, restart, isGameOver, getCurrentPlayer };
  })();
  
  // Display Controller
  const DisplayController = (() => {
    const boardElement = document.getElementById("board");
    const messageElement = document.getElementById("message");
  
    const render = () => {
      if (!boardElement) return;
      boardElement.innerHTML = "";
      Gameboard.getBoard().forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.textContent = cell;
        cellDiv.style.cursor = GameController.isGameOver() || cell ? "default" : "pointer";
        cellDiv.addEventListener("click", () => {
          if (GameController.isGameOver() || cell) return;
          GameController.playRound(index);
        });
        boardElement.appendChild(cellDiv);
      });
    };
  
    const showMessage = (msg) => {
      if (messageElement) messageElement.textContent = msg;
    };
  
    return { render, showMessage };
  })();
  
  // Initial render and restart button setup
  document.addEventListener("DOMContentLoaded", () => {
    DisplayController.render();
    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        GameController.restart();
      });
    }
  });
  