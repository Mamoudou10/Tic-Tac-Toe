const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const updateCell = (index, value) => {
        if (board[index] === "") {
            board[index] = value;
            return true;
        }
        return false;
    };
    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    }
    return { getBoard, updateCell, resetBoard };
})();