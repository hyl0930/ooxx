let cells = document.querySelectorAll(".cell");
let status = document.getElementById("status");
let restart = document.getElementById("restart");
let modeSelection = document.getElementById("modeSelection");
let gameArea = document.getElementById("gameArea");

let board = ["", "", "", "", "", "", "", "", ""];
let current = "X";
let playing = true;
let gameMode = "";
let playerSymbol = "X";
let computerSymbol = "O";
let isComputerTurn = false;

const win = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// 初始化事件監聽
function initGame() {
    cells.forEach(cell => {
        cell.addEventListener("click", clickCell);
    });
    restart.addEventListener("click", reset);
}

function startGame(mode) {
    gameMode = mode;
    
    // 根據模式設置符號和回合
    if (mode === "pvp") {
        status.textContent = "玩家 X 回合 (人對人)";
    } else if (mode === "pvc") {
        playerSymbol = "X";
        computerSymbol = "O";
        status.textContent = "你是 X，電腦是 O。你先行。";
    } else if (mode === "cvp") {
        playerSymbol = "O";
        computerSymbol = "X";
        current = "X";
        status.textContent = "你是 O，電腦是 X。電腦先行。";
        isComputerTurn = true;
    } else if (mode === "cvc") {
        status.textContent = "電腦對電腦 (自動進行)";
        isComputerTurn = true;
    }
    
    // 隱藏模式選擇，顯示遊戲區域
    modeSelection.style.display = "none";
    gameArea.style.display = "block";
    
    // 重置遊戲
    board = ["", "", "", "", "", "", "", "", ""];
    current = "X";
    playing = true;
    cells.forEach(c => c.textContent = "");
    
    initGame();
    
    // 如果是電腦先手，執行電腦回合
    if (isComputerTurn && gameMode === "cvp") {
        setTimeout(computerMove, 500);
    } else if (gameMode === "cvc") {
        setTimeout(computerMove, 500);
    }
}

function clickCell() {
    // PvP 或 PvC 模式下，玩家才能點擊
    if (gameMode === "pvc" && current !== playerSymbol) return;
    if (gameMode === "cvp" && current !== playerSymbol) return;
    if (gameMode === "cvc") return; // CvC 不允許點擊
    if (!playing) return;
    
    const i = this.dataset.index;
    
    if (board[i] !== "") return;
    
    makeMove(i);
}

function makeMove(index) {
    board[index] = current;
    document.querySelector(`[data-index="${index}"]`).textContent = current;
    
    if (checkWin()) {
        if (gameMode === "pvp") {
            status.textContent = `🎉 玩家 ${current} 獲勝！`;
        } else if (gameMode === "pvc") {
            if (current === playerSymbol) {
                status.textContent = `🎉 你獲勝了！`;
            } else {
                status.textContent = `😔 電腦獲勝了！`;
            }
        } else if (gameMode === "cvp") {
            if (current === playerSymbol) {
                status.textContent = `🎉 你獲勝了！`;
            } else {
                status.textContent = `😔 電腦獲勝了！`;
            }
        } else if (gameMode === "cvc") {
            if (current === "X") {
                status.textContent = `🎉 X (電腦 1) 獲勝！`;
            } else {
                status.textContent = `🎉 O (電腦 2) 獲勝！`;
            }
        }
        playing = false;
        return;
    }
    
    if (!board.includes("")) {
        status.textContent = "平手！";
        playing = false;
        return;
    }
    
    current = current === "X" ? "O" : "X";
    
    // 更新狀態文字
    if (gameMode === "pvp") {
        status.textContent = `玩家 ${current} 回合`;
    } else if (gameMode === "pvc") {
        if (current === playerSymbol) {
            status.textContent = `你的回合 (${playerSymbol})`;
        } else {
            status.textContent = `電腦思考中...`;
            setTimeout(computerMove, 800);
        }
    } else if (gameMode === "cvp") {
        if (current === playerSymbol) {
            status.textContent = `你的回合 (${playerSymbol})`;
        } else {
            status.textContent = `電腦思考中...`;
            setTimeout(computerMove, 800);
        }
    } else if (gameMode === "cvc") {
        status.textContent = `電腦 ${current === "X" ? "1" : "2"} 思考中...`;
        setTimeout(computerMove, 1000);
    }
}

function computerMove() {
    if (!playing) return;
    
    const emptyIndices = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    
    if (emptyIndices.length === 0) return;
    
    // 簡單 AI 策略
    let bestMove = findBestMove();
    
    makeMove(bestMove);
}

function findBestMove() {
    // 優先順序：
    // 1. 如果能贏，就贏
    // 2. 如果對手能贏，就擋
    // 3. 隨機選擇
    
    const emptyIndices = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    
    // 檢查是否能贏
    for (let move of emptyIndices) {
        board[move] = current;
        if (checkWin()) {
            board[move] = "";
            return move;
        }
        board[move] = "";
    }
    
    // 檢查是否需要擋
    const opponent = current === "X" ? "O" : "X";
    for (let move of emptyIndices) {
        board[move] = opponent;
        if (checkWin()) {
            board[move] = "";
            return move;
        }
        board[move] = "";
    }
    
    // 優先選擇中心或角落
    const strategic = [4, 0, 2, 6, 8].filter(i => emptyIndices.includes(i));
    if (strategic.length > 0) {
        return strategic[0];
    }
    
    // 隨機選擇
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function checkWin() {
    return win.some(c => {
        return c.every(i => board[i] === current);
    });
}

function reset() {
    board = ["", "", "", "", "", "", "", "", ""];
    current = gameMode === "cvp" ? "X" : "X";
    playing = true;
    isComputerTurn = false;
    
    if (gameMode === "pvp") {
        status.textContent = "玩家 X 回合";
    } else if (gameMode === "pvc") {
        status.textContent = `你是 X，電腦是 O。你先行。`;
    } else if (gameMode === "cvp") {
        status.textContent = `你是 O，電腦是 X。電腦先行。`;
        isComputerTurn = true;
    } else if (gameMode === "cvc") {
        status.textContent = "電腦對電腦 (自動進行)";
        isComputerTurn = true;
    }
    
    cells.forEach(c => c.textContent = "");
    
    if (isComputerTurn && (gameMode === "cvp" || gameMode === "cvc")) {
        setTimeout(computerMove, 500);
    }
}

function backToMenu() {
    modeSelection.style.display = "block";
    gameArea.style.display = "none";
    gameMode = "";
    board = ["", "", "", "", "", "", "", "", ""];
    current = "X";
    playing = true;
    cells.forEach(c => c.textContent = "");
}