let cart = [];
let currentCategory = 'all';

function copyIP() {
    const ip = document.getElementById("serverIP").innerText;
    navigator.clipboard.writeText(ip).then(() => alert("Sunucu IP kopyalandı: " + ip));
}

function toggleCart() {
    document.getElementById("cartDrawer").classList.toggle("open");
}

function toggleModal() {
    document.getElementById("loginModal").classList.toggle("active");
}

function saveUser() {
    const user = document.getElementById("mcUser").value;
    if(user.trim()) {
        document.getElementById("userBtnText").innerText = user;
        toggleModal();
        alert("Başarıyla giriş yapıldı: " + user);
    } else {
        alert("Lütfen geçerli bir kullanıcı adı girin.");
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
}

function updateCartUI() {
    const list = document.getElementById("cartItemsList");
    const badge = document.getElementById("cartBadge");
    const totalEl = document.getElementById("cartTotalPrice");

    badge.innerText = cart.reduce((sum, i) => sum + i.qty, 0);

    if(cart.length === 0) {
        list.innerHTML = `<p class="empty-cart">Sepetiniz şu an boş.</p>`;
        totalEl.innerText = "0.00 ₺";
        return;
    }

    let html = "";
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.qty;
        html += `
            <div class="cart-row">
                <div>
                    <strong style="font-size:0.85rem; color:#fff; display:block;">${item.name}</strong>
                    <small style="color:var(--primary); font-size:0.75rem;">${item.price} ₺ x ${item.qty}</small>
                </div>
                <button onclick="removeItem(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });
    list.innerHTML = html;
    totalEl.innerText = total.toFixed(2) + " ₺";
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function switchCategory(cat, el) {
    currentCategory = cat;
    document.querySelectorAll(".tab-chip").forEach(c => c.classList.remove("active"));
    el.classList.add("active");
    filterProducts();
}

function filterProducts() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {
        const cat = card.getAttribute("data-category");
        const name = card.getAttribute("data-name").toLowerCase();
        const matchesCat = (currentCategory === 'all' || cat === currentCategory);
        const matchesQuery = name.includes(query);

        card.style.display = (matchesCat && matchesQuery) ? "flex" : "none";
    });
}

function checkout() {
    if(cart.length === 0) {
        alert("Sepetiniz boş!");
        return;
    }
    alert("Ödeme simülasyonu başarılı! Ürünler hesabınıza eklenecektir.");
    cart = [];
    updateCartUI();
    toggleCart();
}

function sendTicket() {
    const name = document.getElementById("supName").value;
    const subject = document.getElementById("supSubject").value;
    const msg = document.getElementById("supMsg").value;

    if(name.trim() && subject.trim() && msg.trim()) {
        alert("Destek talebiniz başarıyla oluşturuldu! En kısa sürede Discord üzerinden dönüş yapılacaktır.");
        document.getElementById("supName").value = '';
        document.getElementById("supSubject").value = '';
        document.getElementById("supMsg").value = '';
    } else {
        alert("Lütfen tüm alanları eksiksiz doldurun.");
    }
}
