const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: 3.5,
    z: 3.5,
    angle: 0,
    speed: 0.05,
    rotSpeed: 0.04
};

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function updatePlayer() {
    if (keys["ArrowLeft"]) player.angle -= player.rotSpeed;
    if (keys["ArrowRight"]) player.angle += player.rotSpeed;

    let dx = Math.cos(player.angle) * player.speed;
    let dz = Math.sin(player.angle) * player.speed;

    if (keys["ArrowUp"]) tryMove(dx, dz);
    if (keys["ArrowDown"]) tryMove(-dx, -dz);

    // strafe
    if (keys["a"]) tryMove(-dz, dx);
    if (keys["d"]) tryMove(dz, -dx);
}

function tryMove(dx, dz) {
    let nx = player.x + dx;
    let nz = player.z + dz;

    if (MAP[Math.floor(nz)][Math.floor(nx)] === 0) {
        player.x = nx;
        player.z = nz;
    }
}

function castRay(angle) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);

    for (let t = 0; t < 20; t += 0.01) {
        let x = player.x + cos * t;
        let z = player.z + sin * t;

        if (MAP[Math.floor(z)][Math.floor(x)] === 1) {
            return t;
        }
    }
    return 20;
}

function render() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let fov = Math.PI / 3;
    let numRays = canvas.width;
    let halfH = canvas.height / 2;

    for (let i = 0; i < numRays; i++) {
        let rayAngle = player.angle - fov/2 + (i / numRays) * fov;
        let dist = castRay(rayAngle);

        let wallHeight = (1 / dist) * 600;

        ctx.fillStyle = `rgb(${200 / dist}, 0, 0)`;
        ctx.fillRect(i, halfH - wallHeight/2, 1, wallHeight);
    }
}

function loop() {
    updatePlayer();
    render();
    requestAnimationFrame(loop);
}

loop();
