// --- 1. Custom Tech Cursor ---
const cursor = document.querySelector('.cursor-tech');
const interactables = document.querySelectorAll('a, .btn-primary, .btn-secondary, .glass-card, .menu-toggle, iframe');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.background = 'rgba(0, 255, 209, 0.1)';
        cursor.style.borderColor = 'transparent';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.background = 'transparent';
        cursor.style.borderColor = 'var(--accent)';
    });
});

// --- 2. Mobile Menu ---
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fechar menu ao clicar num link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// --- 3. Scroll Reveal ---
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

fadeElements.forEach(el => observer.observe(el));

// --- 4. Data Nodes Background (Efeito Analista de Dados) ---
const canvas = document.getElementById('dataNetworkCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

class DataNode {
    constructor(x, y, dx, dy, size) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(0, 255, 209, 0.5)'; // Cor accent
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
        if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;
        
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

function init() {
    particles = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Calcula quantidade de partículas pelo tamanho da tela para não travar
    let numberOfParticles = (canvas.width * canvas.height) / 15000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (innerWidth - size * 2) + size;
        let y = Math.random() * (innerHeight - size * 2) + size;
        let dx = (Math.random() - 0.5) * 1;
        let dy = (Math.random() - 0.5) * 1;
        particles.push(new DataNode(x, y, dx, dy, size));
    }
}

function connectNodes() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                         + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
            
            // Conecta partículas próximas
            if (distance < (canvas.width/10) * (canvas.height/10)) {
                let opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = `rgba(0, 255, 209, ${opacityValue * 0.2})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
        // Interação com o mouse
        if(mouse.x != null) {
            let dx = mouse.x - particles[a].x;
            let dy = mouse.y - particles[a].y;
            let distanceMouse = dx * dx + dy * dy;
            if (distanceMouse < mouse.radius * mouse.radius) {
                ctx.strokeStyle = `rgba(240, 237, 229, 0.3)`; // Fio cor Sand conectando ao mouse
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    connectNodes();
}

init();
animate();

// Limpa a posição do mouse quando sai da tela
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});