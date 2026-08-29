// ==========================================================================
// XynovSMP - Interactive & Dynamic Script
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Background System
    initParticles();

    // 2. IP Copy Functionality
    initCopyIP();

    // 3. Wheel of Fortune Modal & Game
    initWheelOfFortune();
});

// --- Nether Spark Particles ---
function initParticles() {
    const canvas = document.getElementById('nether-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 1.5 + 0.5),
        speedX: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.8 + 0.2
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;

            if (p.y < 0) {
                p.y = height;
                p.x = Math.random() * width;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 100 + 50)}, 0, ${p.opacity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff4500';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// --- IP Copy to Clipboard ---
function initCopyIP() {
    const copyBtn = document.getElementById('copy-ip-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', async () => {
        const ipText = 'play.xynovsmp.com';
        const copyTextEl = copyBtn.querySelector('.copy-text');

        try {
            await navigator.clipboard.writeText(ipText);
            copyTextEl.textContent = 'KOPYALANDI!';
            copyBtn.style.borderColor = '#00ff88';

            setTimeout(() => {
                copyTextEl.textContent = 'KOPYALA';
                copyBtn.style.borderColor = '';
            }, 2000);
        } catch (err) {
            console.error('Kopyalama başarısız:', err);
        }
    });
}

// --- Şans Çarkı Mantığı ---
function initWheelOfFortune() {
    const openBtn = document.getElementById('open-wheel-btn');
    const closeBtn = document.getElementById('close-modal');
    const modal = document.getElementById('wheel-modal');
    const spinBtn = document.getElementById('spin-btn');
    const wheel = document.getElementById('wheel');
    const resultText = document.getElementById('wheel-result');

    if (!modal || !spinBtn) return;

    openBtn.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));

    let isSpinning = false;

    spinBtn.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        resultText.textContent = 'Çark dönüyor... Bol şans!';

        const randomDeg = Math.floor(1800 + Math.random() * 360); // En az 5 tur
        wheel.style.transform = `rotate(${randomDeg}deg)`;

        setTimeout(() => {
            isSpinning = false;
            resultText.textContent = '🎉 TEBRİKLER! Ödül hesabınıza aktarıldı!';
        }, 4000);
    });
}
