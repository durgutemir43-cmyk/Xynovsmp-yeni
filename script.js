let cart = [];
let currentCategory = 'all';
let discountRate = 0;

window.addEventListener('DOMContentLoaded', () => {
    checkServerStatus();
    initParticles();
    
    // Kayıtlı tema varsa yükle
    const savedTheme = localStorage.getItem('xynov_theme') || 'orange';
    setTheme(savedTheme, false);
});

// Aternos sunucu IP adresinden canlı durum takibi
async function checkServerStatus() {
    const serverIP = "XynovSmp.aternos.me";
    const countEl = document.getElementById("onlinePlayerCount");
    const dotEl = document.getElementById("statusDot");

    try {
        const response = await fetch(`https://api.mcstatus.io/v2/status/java/${serverIP}`);
        const data = await response.json();

        if (data.online) {
            countEl.innerText = `${data.players.online} / ${data.players.max}`;
            dotEl.className = "pulse-dot";
        } else {
            countEl.innerText = "Sunucu Kapalı (Bekleniyor)";
            dotEl.className = "pulse-dot offline";
        }
    } catch (error) {
        countEl.innerText = "Çevrimdışı / Bağlantı Bekleniyor";
        dotEl.className = "pulse-dot offline";
    }
}

// Tema Değiştirici
function setTheme(themeName, save = true) {
    document.body.setAttribute('data-theme', themeName);
    if(save) {
        localStorage.setItem('xynov_theme', themeName);
        showToast(`Tema değiştirildi: ${themeName.toUpperCase()}`, 'info');
    }
}

// Dinamik Canvas Parçacık Efekti (Arka Plan Yıldız/Toz Efekti)
function initParticles() {
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const count = 45;

    for(let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.8 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.6 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if(p.x < 0) p.x = canvas.width;
            if(p.x > canvas.width) p.x = 0;
            if(p.y < 0) p.y = canvas.height;
            if(p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

function showToast(message, type = 'success') {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast`;
    
    let icon = 'fa-circle-check';
    if(type === 'info') icon = 'fa-circle-info';
    
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color:var(--accent)"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(110%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function copyIP() {
    const ip = "XynovSmp.aternos.me";
    navigator.clipboard.writeText(ip).then(() => {
        showToast("Sunucu IP adresi panoya kopyalandı: " + ip, 'success');
    });
}

function toggleCart() {
    document.getElementById("cartDrawer").classList.toggle("open");
}

function toggleModal() {
    document.getElementById("loginModal").classList.toggle("active");
}

function toggleMobileMenu() {
    document.getElementById("navMenu").classList.toggle("active");
}

// Oyuncu Adı Kaydetme ve Crafatar API ile Gerçek Kafa (Skin) Görseli Çekme
function saveUser() {
    const user = document.getElementById("mcUser").value.trim();
    if(user) {
        document.getElementById("userBtnText").innerText = user;
        
        // Crafatar API ile 3D/2D kafa avatarını modal ikonuna ve header'a yansıt
        const iconContainer = document.getElementById("modalIconContainer");
        iconContainer.innerHTML = `<img src="https://crafatar.com/avatars/${user}?size=64&helm" alt="${user}" onerror="this.onerror=null;this.src='https://crafatar.com/avatars/Notch?size=64&helm';">`;

        toggleModal();
        showToast(`Hoş geldin, ${user}! Hesap bağlandı.`, 'success');
    } else {
        showToast("Lütfen geçerli bir kullanıcı adı girin.", 'info');
    }
}

function addToCart(name, price) {
    const item = cart.find(i => i.name === name);
    if(item) {
        item.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartUI();
    toggleCart();
    showToast(`${name} sepete eklendi!`, 'success');
}

function updateCartUI() {
    const list = document.getElementById("cartItemsList");
    const badge = document.getElementById("cartBadge");
    const totalEl = document.getElementById("cartTotalPrice");

    badge.innerText = cart.reduce((sum, i) => sum + i.qty, 0);

    if(cart.length === 0) {
        list.innerHTML = `<p class="empty-msg">Sepetinizde ürün bulunmuyor.</p>`;
        totalEl.innerText = "0.00 ₺";
        discountRate = 0;
        return;
    }

    let html = "";
    let subtotal = 0;
    cart.forEach((item, index) => {
        subtotal += item.price * item.qty;
        html += `
            <div class="cart-item-row">
                <div>
                    <strong style="font-size:0.85rem; color:#fff; display:block;">${item.name}</strong>
                    <small style="color:var(--accent); font-size:0.75rem;">${item.price} ₺ x ${item.qty}</small>
                </div>
                <button onclick="removeItem(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.85rem;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });
    list.innerHTML = html;
    
    let finalTotal = subtotal * (1 - discountRate);
    totalEl.innerText = finalTotal.toFixed(2) + " ₺";
}

function removeItem(index) {
    const removedName = cart[index].name;
    cart.splice(index, 1);
    updateCartUI();
    showToast(`${removedName} sepetten çıkarıldı.`, 'info');
}

function applyCoupon() {
    const code = document.getElementById("couponInput").value.trim().toUpperCase();
    if(code === "XYNOV" || code === "XYNOV20") {
        discountRate = 0.20;
        updateCartUI();
        showToast("İndirim kuponu uygulandı! (%20 İndirim)", 'success');
    } else {
        showToast("Geçersiz veya süresi dolmuş kupon kodu.", 'info');
    }
}

function switchCategory(cat, el) {
    currentCategory = cat;
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    el.classList.add("active");
    filterProducts();
}

function filterProducts() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const items = document.querySelectorAll(".product-item");

    items.forEach(item => {
        const cat = item.getAttribute("data-category");
        const name = item.getAttribute("data-name").toLowerCase();
        const matchesCat = (currentCategory === 'all' || cat === currentCategory);
        const matchesQuery = name.includes(query);

        item.style.display = (matchesCat && matchesQuery) ? "flex" : "none";
    });
}

function checkout() {
    if(cart.length === 0) {
        showToast("Sepetiniz boş!", 'info');
        return;
    }
    showToast("Güvenli ödeme ağ geçidine bağlanılıyor...", 'success');
    setTimeout(() => {
        alert("Ödeme simülasyonu başarılı! Ürünler XynovSmp.aternos.me sunucusundaki hesabınıza başarıyla tanımlandı.");
        cart = [];
        discountRate = 0;
        updateCartUI();
        toggleCart();
    }, 1200);
}
