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
    let winCombo = [];
  
    const playRound = (index) => {
      if (gameOver) return;
  
      const success = Gameboard.updateCell(index, currentPlayer.marker);
      if (!success) return;
  
      const winnerCombo = checkWinner(currentPlayer.marker);
      if (winnerCombo) {
        winCombo = winnerCombo;
        DisplayController.showMessage(`${currentPlayer.name} wins!`, true);
        gameOver = true;
        DisplayController.render(winCombo);
        return;
      }
  
      if (Gameboard.getBoard().every(cell => cell !== "")) {
        DisplayController.showMessage("It's a draw!", false);
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
      for (let combo of wins) {
        if (combo.every(i => b[i] === marker)) {
          return combo;
        }
      }
      return false;
    };
  
    const restart = () => {
      Gameboard.resetBoard();
      currentPlayer = player1;
      gameOver = false;
      winCombo = [];
      DisplayController.showMessage("Tic Tac Toe");
      DisplayController.render();
    };
  
    const isGameOver = () => gameOver;
    const getCurrentPlayer = () => currentPlayer;
    const getWinCombo = () => winCombo;
  
    return { playRound, restart, isGameOver, getCurrentPlayer, getWinCombo };
  })();
  
  // Display Controller
  const DisplayController = (() => {
    const boardElement = document.getElementById("board");
    const messageElement = document.getElementById("message");
  
    const render = (winCombo = []) => {
      if (!boardElement) return;
      boardElement.innerHTML = "";
      const comboSet = new Set(winCombo);
      Gameboard.getBoard().forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.textContent = cell;
        cellDiv.style.cursor = GameController.isGameOver() || cell ? "default" : "pointer";
        if (comboSet.has(index)) {
          cellDiv.classList.add("win");
        }
        cellDiv.addEventListener("click", () => {
          if (GameController.isGameOver() || cell) return;
          GameController.playRound(index);
        });
        boardElement.appendChild(cellDiv);
      });
    };
  
    const showMessage = (msg, isWin = false) => {
      if (messageElement) {
        messageElement.textContent = msg;
        messageElement.classList.remove("win-message");
        if (isWin) {
          void messageElement.offsetWidth;
          messageElement.classList.add("win-message");
        }
      }
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
  