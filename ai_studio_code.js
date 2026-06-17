// Data Controller
let state = {
    products: JSON.parse(localStorage.getItem('premium_products')) || [
        { id: 1, name: 'Netflix Premium', price: '35.000', stock: 12, logo: 'https://cdn-icons-png.flaticon.com/512/5977/5977590.png' }
    ],
    qris: localStorage.getItem('premium_qris') || 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=SET_QRIS_IN_DASHBOARD'
};

// Initialize Lucide Icons
lucide.createIcons();

// Smooth Scroll
const lenis = new Lenis();
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// Render Storefront
function renderStore() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    
    state.products.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                <div class="card-top">
                    <img src="${p.logo}" class="app-logo" onerror="this.src='https://via.placeholder.com/100'">
                    <span class="stock-badge">STOK: ${p.stock}</span>
                </div>
                <h3>${p.name}</h3>
                <div class="price">Rp ${p.price}</div>
                <button class="btn-primary" onclick="openPayment('${p.name}', '${p.price}')">Order Now</button>
            </div>
        `;
    });
}

// Render Admin List
function renderAdminList() {
    const list = document.getElementById('adminProductList');
    list.innerHTML = '';
    state.products.forEach((p, i) => {
        list.innerHTML += `
            <div style="display:flex; justify-content:space-between; padding:15px; border-bottom:1px solid #333; align-items:center;">
                <span>${p.name} (Rp ${p.price})</span>
                <button onclick="deleteProduct(${i})" style="background:none; border:none; color:red; cursor:pointer;">Hapus</button>
            </div>
        `;
    });
}

// Actions
function deleteProduct(index) {
    state.products.splice(index, 1);
    saveState();
}

function saveState() {
    localStorage.setItem('premium_products', JSON.stringify(state.products));
    renderStore();
    renderAdminList();
}

// Form Handlers
document.getElementById('productForm').onsubmit = (e) => {
    e.preventDefault();
    const newP = {
        id: Date.now(),
        name: document.getElementById('pName').value,
        price: document.getElementById('pPrice').value,
        stock: document.getElementById('pStock').value,
        logo: document.getElementById('pLogo').value
    };
    state.products.push(newP);
    saveState();
    e.target.reset();
};

document.getElementById('qrisUpload').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        state.qris = reader.result;
        localStorage.setItem('premium_qris', reader.result);
        alert('QRIS Updated!');
    };
    reader.readAsDataURL(e.target.files[0]);
};

// UI Toggles
document.getElementById('adminBtn').onclick = () => document.getElementById('dashboard').classList.remove('hidden');
document.getElementById('closeAdmin').onclick = () => document.getElementById('dashboard').classList.add('hidden');

function openPayment(name, price) {
    document.getElementById('modalAppName').innerText = name;
    document.getElementById('modalPrice').innerText = 'Rp ' + price;
    document.getElementById('qrisImg').src = state.qris;
    document.getElementById('paymentModal').style.display = 'flex';
    gsap.from(".modal-content", { y: 50, opacity: 0, duration: 0.5 });
}

function closeModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Initial Load
renderStore();
renderAdminList();
gsap.from(".animate-text", { y: 30, opacity: 0, stagger: 0.2, duration: 1 });