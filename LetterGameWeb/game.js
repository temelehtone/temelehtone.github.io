const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const buttons = document.querySelectorAll("[data-button]");
const shiftButton = document.querySelector(".shift");

canvas.width = innerWidth;
canvas.height = innerHeight;

let img;
const appleImg = document.getElementById("apple");
const canBack = document.getElementById("gameBackground");

const bcW = canvas.width / 2;
const bcH = canvas.height;

// Sets up background for menu buttons

canBack.style.width = `${bcW}px`;
canBack.style.height = `${bcH}px`;
canBack.style.background = "black";
canBack.style.position = "fixed";

// Properties

let startScreen = true;
let difScreen = false;
let gameScreen = false;
let endScreen = false;
let easy = false;
let medium = false;
let hard = false;

let speed;
let spawner;

let score = 0;
let lives = 3;

let apple;
let apples = [];
let letters = [];
let newLetter;
let indexOfLetter;

let particles = [];

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const WORDS = [
  "happy",
  "sun",
  "cat",
  "dog",
  "horse",
  "bark",
  "bat",
  "bite",
  "bolt",
  "bowl",
  "box",
  "can",
  "check",
  "clip",
  "club",
  "dip",
  "down",
  "dress",
  "eye",
  "fair",
  "file",
  "foot",
  "fly",
  "gum",
  "hard",
  "hide",
  "jam",
  "last",
  "left",
  "right",
  "mean",
  "miss",
  "nails",
  "over",
  "park",
  "pen",
  "play",
  "punch",
  "ring",
  "rock",
  "shake",
  "stick",
  "stuff",
  "swing",
  "France",
  "Dubai",
  "German",
  "Moon",
  "Blue",
  "Red",
  "Green",
  "White",
  "Black",
  "Fiji",
  "Peru",
  "Iran",
  "Cuba",
  "Oman",
];

// Creates buttons for menus
class CreateButton {
  constructor(x, y, width, height, color, txt) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.txt = txt;
  }
  drawButton() {
    c.fillStyle = this.color;

    c.fillRect(this.x, this.y, this.width, this.height);
    c.clearRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);

    c.fillStyle = "white";
    c.font = "40px Arial bold";
    let textWidth = c.measureText(this.txt).width;

    c.fillText(this.txt, this.x + this.width / 2 - textWidth / 2, this.y + 53);
  }
}

// Creates apple
class Apple {
  constructor(width, height, x, y, letter) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.letter = letter;
  }
  draw() {
    c.drawImage(appleImg, this.x, this.y, this.width, this.height);
    c.fillStyle = "blue";
    c.fillText(this.letter, this.x + 34, this.y + 80);
    this.y += speed;
  }
  checkCollision() {
    if (this.y + 100 > canvas.height) {
      return true;
    }
  }
}
class Word {
  constructor(x, y, word) {
    this.x = x;
    this.y = y;
    this.word = word;
  }
  draw() {
    let lenghtOfWords = 0;
    c.font = "60px Arial";

    for (let i = 0; i < gameWord.word.length; i++) {
      c.fillStyle = colors[i];
      c.fillText(gameWord.word.charAt(i), this.x + lenghtOfWords, this.y);
      lenghtOfWords += c.measureText(gameWord.word.charAt(i)).width;
    }
    this.y += speed;
  }
  checkCollision() {
    if (this.y + 2 > canvas.height) {
      return true;
    }
  }
}

class ScoreText {
  constructor(x, y, txt, color, count) {
    this.x = x;
    this.y = y;
    this.txt = txt;
    this.color = color;
    this.count = count;
  }
  draw() {
    c.fillStyle = this.color;
    c.font = "40px Arial bold";
    c.fillText(this.txt + this.count, this.x + 34, this.y + 80);
  }
}

const friction = 0.99;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

// Gets the mouse position
function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

// Function to check whether a cursor is inside a rectangle
function isInside(pos, rect) {
  return (
    pos.x > rect.x &&
    pos.x < rect.x + rect.width &&
    pos.y < rect.y + rect.height &&
    pos.y > rect.y
  );
}

// Binding the click event on the canvas
addEventListener("click", function screen(evt) {
  var mousePos = getMousePos(canvas, evt);
  if (isInside(mousePos, startButton) && startScreen) {
    setTimeout(() => {
      startScreen = false;
      difScreen = true;
    }, 0);
  }
  if (isInside(mousePos, easyButton) && difScreen) {
    setTimeout(() => {
      difScreen = false;
      gameScreen = true;
      easy = true;
      livesText.count = 3;
      speed = 3;
      spawnApple();
    }, 0);
  }
  if (isInside(mousePos, mediumButton) && difScreen) {
    setTimeout(() => {
      difScreen = false;
      gameScreen = true;
      medium = true;
      livesText.count = 5;
      speed = 2;
    }, 0);
  }
  if (isInside(mousePos, hardButton) && difScreen) {
    setTimeout(() => {
      difScreen = false;
      gameScreen = true;
      hard = true;
      livesText.count = 5;
      speed = 4;
    }, 0);
  }
  if (isInside(mousePos, newGameButton) && endScreen) {
    setTimeout(() => {
      init();
    }, 0);
  }
});

function init() {
  easy = false;
  medium = false;
  hard = false;
  startScreen = true;
  endScreen = false;
  scoreText.count = 0;
  apples = [];
  particles = [];
  letters = []
  newWord();
}

// Game loop, updates the screen
let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);

  if (startScreen) {
    img = document.getElementById("startMenu");
    c.drawImage(img, 0, 0, canvas.width / 2, canvas.height);
    startButton.drawButton();
  }
  if (difScreen) {
    img = document.getElementById("startMenu");
    c.drawImage(img, 0, 0, canvas.width / 2, canvas.height);
    easyButton.drawButton();
    mediumButton.drawButton();
    hardButton.drawButton();
  }
  if (gameScreen) {
    img = document.getElementById("background");
    if (img.complete) {
      c.drawImage(img, 0, 0, canvas.width / 2, canvas.height);
    }

    scoreText.draw();
    livesText.draw();
    if (easy) {
      apples.forEach((apple, index) => {
        apple.draw();

        if (apple.checkCollision()) {
          for (let i = 0; i < Math.random() * 10 + 10; i++) {
            particles.push(
              new Particle(
                apple.x + 50,
                apple.y + 50,
                Math.random() * 5,
                "rgb(255,0,0)",
                {
                  x: (Math.random() - 0.5) * (Math.random() * 8),
                  y: (Math.random() - 0.5) * (Math.random() * 8),
                }
              )
            );
          }
          setTimeout(() => {
            livesText.count -= 1;
            apples.splice(index, 1);
            letters.splice(letters.indexOf(apple.letter), 1);
          }, 0);
        }
      });

      checkLetter()

      particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
          particles.splice(index, 1);
        } else {
          particle.update();
        }
      });
    } else {
      gameWord.draw();
      if (counter === gameWord.word.length) {
        newWord();
        scoreText.count += 1;
      }
      if (gameWord.checkCollision()) {
        newWord();
        livesText.count -= 1;
      }
      checkButton();
    }
    if (livesText.count <= 0) {
      gameScreen = false;
      endScreen = true;
    }
  }
  if (endScreen) {
    clearInterval(spawner);
    img = document.getElementById("background");
    c.drawImage(img, 0, 0, canvas.width / 2, canvas.height);
    scoreText.draw();
    livesText.draw();
    newGameButton.drawButton();
    setBackgrounds()
    livesText.count = 0
  }
}

function setBackgrounds() {
  buttons.forEach((button) => {
    button.style.background = "white"
  })
}

function checkButton() {
  buttons.forEach((button) => {
    if (!(gameWord.word[counter] == gameWord.word[counter].toUpperCase())) {
      if (button.innerText == gameWord.word[counter].toUpperCase()) {
        button.style.background = "yellow";
      } else {
        button.style.background = "white";
        shiftButton.style.background = "white";
      }
    } else {
      if (button.innerText == gameWord.word[counter]) {
        button.style.background = "yellow";
        shiftButton.style.background = "yellow";
      } else {
        button.style.background = "white";
      }
    }
  });
}

function checkLetter() {
  
  buttons.forEach(button => {
    if (button.innerText === letters[0]) {
      button.style.background = "yellow";
    }  else {
      button.style.background = "white";
    }
  });
  
}

// Spawns apple every 0.7 seconds

function spawnApple() {
  spawner = setInterval(() => {
    while (true) {
      indexOfLetter = Math.random() * alphabets.length - 1;

      if (!letters.includes(alphabets.charAt(indexOfLetter))) {
        break;
      }
    }

    newLetter = alphabets.charAt(indexOfLetter);
    apples.push(
      new Apple(
        100,
        100,
        Math.random() * (canvas.width / 2 - 300) + 100,
        -200,
        newLetter
      )
    );
    letters.push(newLetter);
  }, 700);
}

// Creates a new word
function newWord() {
  colors = [];
  counter = 0;
  gameWord.x = Math.random() * (canvas.width / 2 - 300) + 100;
  gameWord.y = -50;
  gameWord.word = WORDS[parseInt(Math.random() * WORDS.length - 1)];
  for (let i = 0; i < gameWord.word.length; i++) {
    colors.push("white");
  }
}

// Buttons and texts for menus

const startButton = new CreateButton(
  canvas.width / 4 - 200,
  canvas.height / 3 + 100,
  400,
  80,
  "#00f",
  "START GAME"
);
const easyButton = new CreateButton(
  canvas.width / 4 - 200,
  canvas.height / 3,
  400,
  80,
  "green",
  "EASY"
);
const mediumButton = new CreateButton(
  canvas.width / 4 - 200,
  canvas.height / 3 + 100,
  400,
  80,
  "yellow",
  "MEDIUM"
);
const hardButton = new CreateButton(
  canvas.width / 4 - 200,
  canvas.height / 3 + 200,
  400,
  80,
  "red",
  "HARD"
);
const newGameButton = new CreateButton(
  canvas.width / 4 - 200,
  canvas.height / 3 + 100,
  400,
  80,
  "blue",
  "NEW GAME"
);

const scoreText = new ScoreText(-20, -20, `Score: `, "blue", score);
const livesText = new ScoreText(
  canvas.width / 2 - 185,
  -20,
  `Lives: `,
  "red",
  lives
);

let counter = 0;
let colors = [];

const gameWord = new Word(
  Math.random() * (canvas.width / 2 - 300) + 100,
  -50,
  WORDS[parseInt(Math.random() * WORDS.length - 1)]
);
for (let i = 0; i < gameWord.word.length; i++) {
  colors.push("white");
}

// Checks which key is pressed

addEventListener("keypress", logKey);
function logKey(e) {
  
  if (easy) {
    apples.forEach((apple, index) => {
      if (e.key.toUpperCase() === apple.letter) {
        setTimeout(() => {
          scoreText.count += 1;
          apples.splice(index, 1);
          letters.splice(letters.indexOf(apple.letter), 1);
        }, 0);
        for (let i = 0; i < Math.random() * 10 + 10; i++) {
          particles.push(
            new Particle(
              apple.x + 50,
              apple.y + 50,
              Math.random() * 5,
              "rgb(0,255,0)",
              {
                x: (Math.random() - 0.5) * (Math.random() * 8),
                y: (Math.random() - 0.5) * (Math.random() * 8),
              }
            )
          );
        }
      }
    });
  } else {
    if (e.key === gameWord.word.charAt(counter)) {
      colors[counter] = "green";
    } else {
      colors[counter] = "red";
      livesText.count -= 1;
    }
    counter += 1;
  }
}

animate();
