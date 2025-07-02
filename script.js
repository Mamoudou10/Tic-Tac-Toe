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
    let player1 = Player("Joueur 1", "X");
    let player2 = Player("Joueur 2", "O");
    let currentPlayer = player1;
    let gameOver = false;
    let winCombo = [];
  
    const setPlayerNames = (name1, name2) => {
      player1 = Player(name1 || "Joueur 1", "X");
      player2 = Player(name2 || "Joueur 2", "O");
      currentPlayer = player1;
    };
  
    const playRound = (index) => {
      if (gameOver) return;
  
      const success = Gameboard.updateCell(index, currentPlayer.marker);
      if (!success) return;
  
      const winnerCombo = checkWinner(currentPlayer.marker);
      if (winnerCombo) {
        winCombo = winnerCombo;
        DisplayController.showMessage(`${currentPlayer.name} a gagné !`, true);
        gameOver = true;
        DisplayController.render(winCombo);
        return;
      }
  
      if (Gameboard.getBoard().every(cell => cell !== "")) {
        DisplayController.showMessage("Match nul !", false);
        gameOver = true;
        DisplayController.render();
        return;
      }
  
      switchPlayer();
      DisplayController.showMessage(`Au tour de : ${currentPlayer.name}`);
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
      DisplayController.showMessage("Morpion");
      DisplayController.render();
    };
  
    const isGameOver = () => gameOver;
    const getCurrentPlayer = () => currentPlayer;
    const getWinCombo = () => winCombo;
    const getPlayers = () => [player1, player2];
  
    return { playRound, restart, isGameOver, getCurrentPlayer, getWinCombo, setPlayerNames, getPlayers };
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
    // Modal gestion
    const modal = document.getElementById("player-modal");
    const form = document.getElementById("player-form");
    const input1 = document.getElementById("player1-name");
    const input2 = document.getElementById("player2-name");
  
    if (modal && form && input1 && input2) {
      // Vider les champs à chaque affichage du modal
      input1.value = "";
      input2.value = "";
      modal.style.display = "flex";
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name1 = input1.value.trim() || "Joueur 1";
        const name2 = input2.value.trim() || "Joueur 2";
        GameController.setPlayerNames(name1, name2);
        modal.style.display = "none";
        DisplayController.showMessage(`Au tour de : ${name1}`);
        DisplayController.render();
      });
    } else {
      // fallback si modal absent
      DisplayController.render();
    }
  
    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        GameController.restart();
        // Afficher le nom du joueur courant après restart
        const [p1, ] = GameController.getPlayers();
        DisplayController.showMessage(`Au tour de : ${p1.name}`);
      });
    }
  });
  