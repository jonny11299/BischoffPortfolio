
let particles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Create particles
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            vx: random(-1, 1),
            vy: random(-1, 1),
            size: random(2, 8)
        });
    }
}

function draw() {
    background(20, 20, 40, 25); // Semi-transparent for trail effect

    noStroke();
    for (let p of particles) {
        fill(100, 150, 255, 150);
        circle(p.x, p.y, p.size);

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}