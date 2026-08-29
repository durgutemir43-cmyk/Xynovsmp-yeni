function copyIP() {
    const ipText = document.getElementById("serverIP").innerText;
    navigator.clipboard.writeText(ipText).then(() => {
        const btn = document.querySelector(".copy-btn");
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-check"></i> KOPYALANDI!';
        btn.style.backgroundColor = '#22c55e';
        btn.style.color = '#fff';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '#ff5500';
            btn.style.color = '#fff';
        }, 2000);
    });
}
