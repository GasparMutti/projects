class Square {
  constructor({position, color, borderColor, borderWidth, isEmpty}) {
    this.position = position;
    this.color = color;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    this.isEmpty = isEmpty;
  }

  draw(ctx) {
    ctx.lineWidth = this.borderWidth;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.borderColor;

    ctx.fillRect(this.position.x, this.position.y, 1, 1);
    ctx.strokeRect(this.position.x, this.position.y, 1, 1);
  }
}

class Tetris {
  static ROWS = 20;
  static COLUMNS = 10;
  static PIECES = {
    smashBoy: {
      color: "#FACC15",
      tetromino: [
        [1, 1],
        [1, 1],
      ],
    },
    hero: {
      color: "#0097BD",
      tetromino: [[1], [1], [1], [1]],
    },
    teewe: {
      color: "purple",
      tetromino: [
        [0, 1, 0],
        [1, 1, 1],
      ],
    },
    orangeRicky: {
      color: "#EA580C",
      tetromino: [
        [1, 0],
        [1, 0],
        [1, 1],
      ],
    },
    blueRicky: {
      color: "blue",
      tetromino: [
        [0, 1],
        [0, 1],
        [1, 1],
      ],
    },
    rodheIslandZ: {
      color: "green",
      tetromino: [
        [0, 1, 1],
        [1, 1, 0],
      ],
    },
    clevelandZ: {
      color: "red",
      tetromino: [
        [1, 1, 0],
        [0, 1, 1],
      ],
    },
  };

  constructor({canvasId, scoreId, styles, sounds}) {
    this.canvasId = canvasId;
    this.scoreId = scoreId;
    this.styles = styles;
    this.sounds = sounds;
    this.isPaused = true;
    this.defaultGameSpeed = 300;
    this.maxGameSpeed = 100;
    this.time = Date.now();
    this.score = 0;
    this.maxScore = window.localStorage.getItem("maxScore") ?? 0;
  }

  async init() {
    this.initDomElements();
    this.initSounds();
    await this.animateGameBoard();
    this.initGameBoard();
    this.initGamePiece();
    this.initControls();
    this.loop();
  }

  initDomElements() {
    this.canvas = document.getElementById(this.canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.scoreElement = document.getElementById(this.scoreId);

    this.setCanvas();

    window.addEventListener("resize", () => {
      this.setCanvas();
      this.drawGameBoard();
      this.drawGamePiece();
    });
  }

  setCanvas() {
    this.blockSize = this.calculateBlockSize();
    this.setCanvasSize();
  }

  calculateBlockSize() {
    const {ROWS} = Tetris;
    return Math.floor(innerHeight / ROWS - (5 % innerHeight));
  }

  setCanvasSize() {
    const {COLUMNS, ROWS} = Tetris;

    this.canvas.setAttribute("width", this.blockSize * COLUMNS);
    this.canvas.setAttribute("height", this.blockSize * ROWS);

    this.ctx.scale(this.blockSize, this.blockSize);
  }

  initSounds() {
    this.sounds.background.loop = true;
    this.sounds.background.volume = 0.2;
  }

  initGameBoard() {
    this.setGameBoard();
    this.drawGameBoard();
  }

  setGameBoard() {
    this.gameBoard = this.createGameBoard();
  }

  createGameBoard() {
    const {ROWS, COLUMNS} = Tetris;
    const {color, borderColor, borderWidth} = this.styles.boardSquare;
    const board = [];

    for (let indexRow = 0; indexRow < ROWS; indexRow++) {
      const newRow = [];

      for (let indexColumn = 0; indexColumn < COLUMNS; indexColumn++) {
        const squareProperties = {
          position: {x: indexColumn, y: indexRow},
          color,
          borderColor,
          borderWidth,
          isEmpty: false,
        };

        newRow.push(new Square(squareProperties));
      }

      board.push(newRow);
    }

    return board;
  }

  async animateGameBoard() {
    const gameBoard = this.createGameBoard();
    for (const row of gameBoard) {
      for (const square of row) {
        square.draw(this.ctx);
        await this.timeout(5);
      }
    }
  }

  drawGameBoard() {
    this.gameBoard.forEach((row) => {
      row.forEach((square) => {
        square.draw(this.ctx);
      });
    });
  }

  initGamePiece() {
    this.setGamePiece();
    this.drawGamePiece();
  }

  setGamePiece() {
    this.gamePiece = this.createGamePiece();
    this.checkGameOver();
  }

  getRandomPiece() {
    const {PIECES} = Tetris;
    const piecesNames = Object.keys(PIECES);
    const randomPieceName =
      piecesNames[Math.floor(Math.random() * piecesNames.length)];
    const {color, tetromino} = {...PIECES[randomPieceName]};

    return {
      name: randomPieceName,
      color,
      tetromino,
    };
  }

  createCanvasPiece({color, tetromino, position}) {
    const {borderColor, borderWidth} = this.styles.boardSquare;
    const {color: emptyColor} = this.styles.emptySquare;

    const canvasPiece = tetromino.map((row, y) => {
      return row.map((value, x) => {
        const squareProperties = {
          position: {
            x: position.x + x,
            y: position.y + y,
          },
          color: value ? color : emptyColor,
          borderColor,
          borderWidth,
          isEmpty: value === 0 ? true : false,
        };

        return new Square(squareProperties);
      });
    });

    return canvasPiece;
  }

  createGamePiece() {
    const position = this.getRandomStartPosition();
    const {name, color, tetromino} = this.getRandomPiece();
    const canvasPiece = this.createCanvasPiece({color, tetromino, position});

    return {
      name,
      color,
      position,
      tetromino,
      canvasPiece,
    };
  }

  getRandomStartPosition() {
    const {COLUMNS} = Tetris;
    return {
      x: Math.floor(Math.random() * (COLUMNS - 2)),
      y: 0,
    };
  }

  checkPieceCollision(canvasPiece, y = 0, x = 0) {
    const {color: emptyColor} = this.styles.emptySquare;
    const {color: boardColor} = this.styles.boardSquare;
    return !!canvasPiece.find((row) =>
      row.find(
        (square) =>
          square.color !== emptyColor &&
          this.gameBoard[square.position.y + y]?.[square.position.x + x]
            ?.color !== boardColor
      )
    );
  }

  solidifyGamePiece() {
    this.gamePiece.canvasPiece.forEach((row) =>
      row.forEach((square) => {
        if (!square.isEmpty)
          this.gameBoard[square.position.y][square.position.x].color =
            square.color;
      })
    );
  }

  moveGamePiece(y, x) {
    this.gamePiece.position.x = this.gamePiece.position.x + x;
    this.gamePiece.position.y = this.gamePiece.position.y + y;

    this.gamePiece.canvasPiece.forEach((row) =>
      row.forEach((square) => {
        square.position.x = square.position.x + x;
        square.position.y = square.position.y + y;
      })
    );
  }

  rotateTetromino(tetromino) {
    const rotatedTetromino = [];
    const tetrominoColumns = tetromino[0].length;
    const tetrominoRows = tetromino.length - 1;

    for (let indexColumn = 0; indexColumn < tetrominoColumns; indexColumn++) {
      const newRow = [];

      for (let indexRow = tetrominoRows; indexRow >= 0; indexRow--) {
        newRow.push(tetromino[indexRow][indexColumn]);
      }

      rotatedTetromino.push(newRow);
    }

    return rotatedTetromino;
  }

  attemptMoveLeft() {
    const {canvasPiece: gamePiece} = this.gamePiece;
    if (this.checkPieceCollision(gamePiece, 0, -1))
      return this.sounds.failedAttempt.play();
    this.moveGamePiece(0, -1);
  }

  attemptMoveDown() {
    const {canvasPiece: gamePiece} = this.gamePiece;
    if (this.checkPieceCollision(gamePiece, 1, 0)) {
      this.solidifyGamePiece();
      this.deleteFullRows();
      this.setGamePiece();
      return;
    }
    this.moveGamePiece(1, 0);
  }

  attemptMoveRight() {
    const {canvasPiece: gamePiece} = this.gamePiece;
    if (this.checkPieceCollision(gamePiece, 0, 1))
      return this.sounds.failedAttempt.play();
    this.moveGamePiece(0, 1);
  }

  attemptRotate() {
    const {tetromino, position, color} = this.gamePiece;
    const rotatedTetromino = this.rotateTetromino(tetromino);
    const rotatedCanvasPiece = this.createCanvasPiece({
      color,
      tetromino: rotatedTetromino,
      position,
    });

    if (this.checkPieceCollision(rotatedCanvasPiece))
      return this.sounds.failedAttempt.play();

    this.gamePiece.tetromino = rotatedTetromino;
    this.gamePiece.canvasPiece = rotatedCanvasPiece;
  }

  drawGamePiece() {
    const {canvasPiece: gamePiece} = this.gamePiece;

    gamePiece.forEach((row) => {
      row.forEach((square) => {
        square.draw(this.ctx);
      });
    });
  }

  getRowsToDelete() {
    const {color: boardColor} = this.styles.boardSquare;
    const rowsToDelete = [];

    this.gameBoard.forEach((row, indexRow) => {
      if (
        this.gameBoard[indexRow].every((square) => square.color !== boardColor)
      )
        rowsToDelete.push(indexRow);
    });

    return rowsToDelete;
  }

  createEmptyRow() {
    const {COLUMNS} = Tetris;
    const {color, borderColor, borderWidth} = this.styles.boardSquare;
    const emptyRow = [];

    for (let indexColumn = 0; indexColumn < COLUMNS; indexColumn++) {
      const squareProperties = {
        position: {x: indexColumn, y: 0},
        color,
        borderColor,
        borderWidth,
        isEmpty: false,
      };

      emptyRow.push(new Square(squareProperties));
    }

    return emptyRow;
  }

  async deleteFullRows() {
    const rowsToDelete = this.getRowsToDelete();
    if (!rowsToDelete.length) return;
    console.log(rowsToDelete);

    this.pauseGame();
    this.sounds.background.play();

    for (let rowIndex = rowsToDelete.length - 1; rowIndex >= 0; rowIndex--) {
      const indexRow = rowsToDelete[rowIndex];

      this.gameBoard[indexRow].forEach((square) => (square.color = "red"));
      this.drawGameBoard();
    }

    await this.timeout(300);

    for (let rowIndex = rowsToDelete.length - 1; rowIndex >= 0; rowIndex--) {
      const indexRow = rowsToDelete[rowIndex];
      this.gameBoard.forEach((row) =>
        row.forEach((square) => {
          square.position.y <= indexRow && square.position.y++;
        })
      );

      this.gameBoard.splice(indexRow, 1);
      this.gameBoard.unshift(this.createEmptyRow());
      rowsToDelete.forEach((_, index) => rowsToDelete[index]++);

      this.score += 100;
      this.updateScore();

      if (this.gameSpeed > this.maxGameSpeed) this.gameSpeed -= 10;
    }

    this.sounds.addScore.play();
    this.resumeGame();
  }

  updateScore() {
    this.scoreElement.innerHTML = this.score;
  }

  resetScore() {
    this.score = 0;
    this.updateScore();
  }

  checkGameOver() {
    const {canvasPiece: gamePiece} = this.gamePiece;
    if (this.checkPieceCollision(gamePiece)) {
      this.sounds.gameOver.play();
      if (this.score > this.maxScore) {
        this.maxScore = this.score;
        window.localStorage.setItem("maxScore", this.maxScore);
      }
      this.resetGame();
      alert(`
      GAME OVER
      SCORE:
      ${this.score}
      MAX SCORE:
      ${this.maxScore}
      `);
    }
  }

  resetGame() {
    this.resetScore();
    this.initGameBoard();
    this.initGamePiece();
    this.pauseGame();
    this.resetSounds();
    this.gameSpeed = this.defaultGameSpeed;
  }

  resetSounds() {
    this.sounds.background.currentTime = 0;
    this.sounds.gameOver.currentTime = 0;
    this.sounds.failedAttempt.currentTime = 0;
    this.sounds.addScore.currentTime = 0;
  }

  resumeGame() {
    this.isPaused = false;
    this.sounds.background.play();
    this.loopId = requestAnimationFrame(this.loop.bind(this));
  }

  pauseGame() {
    this.isPaused = true;
    this.sounds.background.pause();
    cancelAnimationFrame(this.loopId);
  }

  handlePauseGame() {
    this.isPaused ? this.resumeGame() : this.pauseGame();
  }

  handleMute() {
    for (const sound in this.sounds) {
      this.sounds[sound].muted = !this.sounds[sound].muted;
    }
  }

  initControls() {
    const handleKeydown = ({key}) => {
      const handleKey = {
        p: () => this.handlePauseGame(),
        m: () => this.handleMute(),
        w: () => this.attemptRotate(),
        a: () => this.attemptMoveLeft(),
        s: () => this.attemptMoveDown(),
        d: () => this.attemptMoveRight(),
      };

      key = key.toLowerCase();
      if (this.isPaused && key !== "p") return;
      if (!handleKey[key]) return;
      handleKey[key]();
    };

    document.addEventListener("keydown", handleKeydown);
  }

  checkRules() {
    const {canvasPiece: gamePiece} = this.gamePiece;

    if (!this.checkPieceCollision(gamePiece)) return;

    this.solidifyGamePiece();
    this.deleteFullRows();
    this.setGamePiece();
  }

  timeout(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
  }

  loop() {
    if (this.isPaused) return;

    this.now = Date.now();
    this.difference = this.now - this.time;
    this.gameSpeed = this.defaultGameSpeed;

    this.checkRules();

    if (this.difference >= this.gameSpeed) {
      this.attemptMoveDown();
      this.time = this.now;
    }

    this.drawGameBoard();
    this.drawGamePiece();

    this.loopId = requestAnimationFrame(this.loop.bind(this));
  }
}

const tetrisStyles = {
  boardSquare: {
    color: "black",
    borderColor: "white",
    borderWidth: 0.08,
  },
  emptySquare: {
    color: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
  },
};
const tetrisSounds = {
  background: new Audio("assets/songs/background.mp3"),
  gameOver: new Audio("assets/songs/gameOver.mp3"),
  failedAttempt: new Audio("assets/songs/failedAttempt.mp3"),
  addScore: new Audio("assets/songs/addScore.mp3"),
};

const tetrisProperties = {
  canvasId: "tetris",
  scoreId: "score",
  styles: tetrisStyles,
  sounds: tetrisSounds,
};

const tetris = new Tetris(tetrisProperties);
tetris.init();
