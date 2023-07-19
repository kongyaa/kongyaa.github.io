(function () {
  // globals
  var canvas;
  var ctx;
  var W;
  var H;
  var mp = 150; // max particles
  var particles = [];
  var angle = 0;
  var tiltAngle = 0;
  var confettiActive = true;
  var animationComplete = true;
  var deactivationTimerHandler;
  var reactivationTimerHandler;
  var animationHandler;

  // objects
  var particleColors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "pink",
    "SlateBlue",
    "lightblue",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson",
  ];

  function confettiParticle(color) {
    this.x = Math.random() * W; // x-coordinate
    this.y = Math.random() * H - H; // y-coordinate
    this.r = RandomFromTo(10, 15); // radius
    this.d = Math.random() * mp + 10; // density
    this.color = color;
    this.tilt = Math.floor(Math.random() * 10) - 10;
    this.tiltAngleIncremental = (Math.random() * 0.07) + 0.05;
    this.tiltAngle = 0;

    this.draw = function () {
      ctx.beginPath();
      ctx.lineWidth = this.r / 2;
      ctx.strokeStyle = this.color;
      ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
      ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
      ctx.stroke();
    };
  }

  function SetGlobals() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  }

  function InitializeConfetti() {
    particles = [];
    animationComplete = false;
    for (var i = 0; i < mp; i++) {
      var particleColor = particleColors[Math.floor(Math.random() * particleColors.length)];
      particles.push(new confettiParticle(particleColor));
    }
    StartConfetti();
  }

  function Draw() {
    ctx.clearRect(0, 0, W, H);
    var results = [];
    for (var i = 0; i < mp; i++) {
      var particle = particles[i];
      results.push(particle.draw());
    }
    Update();
    return results;
  }

  function RandomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  function Update() {
    var remainingFlakes = 0;
    var particle;
    angle += 0.01;
    tiltAngle += 0.1;

    for (var i = 0; i < mp; i++) {
      particle = particles[i];

      if (animationComplete) return;

      if (!confettiActive && particle.y < -15) {
        particle.y = H + 100;
        continue;
      }

      stepParticle(particle, i);

      if (particle.y <= H) {
        remainingFlakes++;
      }
      CheckForReposition(particle, i);
    }

    if (remainingFlakes === 0) {
      StopConfetti();
    }
  }

  function CheckForReposition(particle, index) {
    if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
      if (index % 5 > 0 || index % 2 === 0) {
        repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 20);
      } else {
        if (Math.sin(angle) > 0) {
          repositionParticle(particle, -20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
        } else {
          repositionParticle(particle, W + 20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
        }
      }
    }
  }

  function stepParticle(particle, particleIndex) {
    particle.tiltAngle += particle.tiltAngleIncremental;
    particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 3;
    particle.x += Math.sin(angle);
    particle.tilt = Math.sin(particle.tiltAngle - particleIndex / 3) * 15;
  }

  function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
    particle.x = xCoordinate;
    particle.y = yCoordinate;
    particle.tilt = tilt;
  }

  function StartConfetti() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    InitializeConfetti();
    (function animloop() {
      if (animationComplete) return null;
      animationHandler = requestAnimationFrame(animloop);
      return Draw();
    })();
  }

  function ClearTimers() {
    clearTimeout(reactivationTimerHandler);
    clearTimeout(animationHandler);
  }

  function DeactivateConfetti() {
    confettiActive = false;
    ClearTimers();
  }

  function StopConfetti() {
    animationComplete = true;
    if (ctx == undefined) return;
    ctx.clearRect(0, 0, W, H);
  }

  function RestartConfetti() {
    ClearTimers();
    StopConfetti();
    confettiActive = true;
    animationComplete = false;
    InitializeConfetti();
  }

  function toggleConfetti() {
    if (confettiActive) {
      DeactivateConfetti();
    } else {
      RestartConfetti();
    }
  }

  window.addEventListener("resize", function () {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  // 편지 메시지 토글 함수
  function toggleMessage() {
    const container = document.querySelector(".container");
    container.classList.toggle("show-message");
    toggleConfetti();
    setTimeout(toggleConfetti, 6000);
  }
})();
