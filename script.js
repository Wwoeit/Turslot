const lever = document.getElementById("leveranim");
const btn = document.getElementById("playBtn");
const slotbg = document.getElementById("slotbg");
const leftimg = document.getElementById("defaultleft");
const centerimg = document.getElementById("defaultcenter");
const rightimg = document.getElementById("defaultright");
const canvas = document.getElementById("effects");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Confetti {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = -10;

    this.size = 6 + Math.random() * 6;
    this.speedY = 2 + Math.random() * 4;
    this.speedX = -2 + Math.random() * 4;
    this.rotation = Math.random() * Math.PI;

    this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += 0.1;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

let confetti = [];
let confettiRunning = false;

function startConfetti(duration) {
  confetti = [];
  confettiRunning = true;

  const startTime = performance.now();

  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (time - startTime < duration) {
      confetti.push(new Confetti());
    }

    confetti.forEach((p) => {
      p.update();
      p.draw();
    });

    confetti = confetti.filter((p) => p.y < canvas.height + 20);

    if (confettiRunning || confetti.length > 0) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(animate);

  setTimeout(() => {
    confettiRunning = false;
  }, duration);
}

const symbols = ["seven", "grape", "lemon", "bar"];

function getRandomSymbol() {
  const index = Math.floor(Math.random() * symbols.length);
  return symbols[index];
}

let playing = false;

btn.addEventListener("click", () => {
  if (playing) return;
  playing = true;
  btn.disabled = true;

  lever.currentTime = 0;
  lever.play();
  leftimg.src = `imgs/spin-left.webm`;
  leftimg.loop = true;
  leftimg.currentTime = 0;
  leftimg.play();
  centerimg.src = `imgs/spin-center.webm`;
  centerimg.loop = true;
  centerimg.currentTime = 0;
  centerimg.play();
  rightimg.src = `imgs/spin-right.webm`;
  rightimg.loop = true;
  rightimg.currentTime = 0;
  rightimg.play();

  lever.addEventListener(
    "ended",
    () => {
      leftimg.loop = false;
      centerimg.loop = false;
      rightimg.loop = false;

      let LEFT = getRandomSymbol();
      let CENTER = getRandomSymbol();
      let RIGHT = getRandomSymbol();
      /*let LEFT = "seven";
      let CENTER = "seven";
      let RIGHT = "seven";*/

      leftimg.src = `imgs/${LEFT}-left.webm`;
      leftimg.currentTime = 0;
      leftimg.play();
      centerimg.src = `imgs/${CENTER}-center.webm`;
      centerimg.currentTime = 0;
      centerimg.play();
      rightimg.src = `imgs/${RIGHT}-right.webm`;
      rightimg.currentTime = 0;
      rightimg.play();

      const SYMBOL_ANIMATION_DURATION = 1500;

      setTimeout(() => {
        if (LEFT === CENTER && CENTER === RIGHT) {
          slotbg.src = `imgs/slotbg-anim.webm`;
          slotbg.currentTime = 0;
          slotbg.play();

          startConfetti(2500);
        }

        playing = false;
        btn.disabled = false;
      }, SYMBOL_ANIMATION_DURATION);
    },
    { once: true }
  );
});
