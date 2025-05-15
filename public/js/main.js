import { World } from './modules/world.js';

window.onload = function () {
  var canvas = document.getElementById('simCanvas');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  var context = canvas.getContext('2d');
  var world = new World(canvas.width, canvas.height, context);

  window.addEventListener('keydown', function (event) {
    const key = event.key.toLowerCase();

    switch (key) {
      case '`':
        world.toggleDebug(); break;

      case ' ':
        world.togglePause(); break;

      case 'i':
        world.toggleInfo(); break;

      case 'v':
        world.toggleSight(); break;

      case 'a':
        world.spawnAgents(1); break;

      case 'b':
        world.spawnBases(1); break;

      case 'f':
        world.spawnItems(1, 'food'); break;

      case 'd':
        world.spawnItems(1, 'drink'); break;

      case 'm':
        world.spawnItems(1, 'medicine'); break;

      default:
        break;
    }

  });

  var lastTime = performance.now();
  function gameLoop(currentTime) {
    var delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    try {
      world.update(delta);
    } catch (err) {
      console.error("Error in world.update():", err);
    }
    world.render();

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
};