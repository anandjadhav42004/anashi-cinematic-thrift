const products = [
    
    { id: 1, title: "Noir Denim Jacket", price: 1299, img: "jacket.jpeg", category: "Western" },
    { id: 2, title: "Silk Void Shirt", price: 899, img: "Silk.jpeg", category: "Western" },
    { id: 4, title: "Urban Trench", price: 2499, img: "Urban.jpeg", category: "Western" },
    

    { id: 5, title: "Vintage Floral Kurti", price: 799, img: "Vintage.jpeg", category: "Indian" },
    

    { id: 3, title: "Retro Soul Dress", price: 1499, img: "Retro.jpeg", category: "Seasonal" },
    { id: 6, title: "Grunge Flannel", price: 699, img: "Grunge.jpeg", category: "Seasonal" }
];

let cart = JSON.parse(localStorage.getItem('anashiCart')) || [];

let currentCategory = 'All';

function renderShop(filter = 'All') {
    currentCategory = filter;
    const container = document.getElementById('shop-container');
    if (!container) return;


    const categories = ['All', 'Indian', 'Western', 'Seasonal'];


    const filterHTML = `
        <div style="display:flex; justify-content:center; gap:10px; margin-bottom:30px; flex-wrap:wrap;">
            ${categories.map(cat => `
                <button 
                    onclick="renderShop('${cat}')" 
                    style="
                        padding: 8px 20px;
                        border: 1px solid #333;
                        background: ${currentCategory === cat ? '#fff' : 'transparent'};
                        color: ${currentCategory === cat ? '#000' : '#fff'};
                        cursor: pointer;
                        border-radius: 20px;
                        transition: 0.3s;
                        font-size: 0.9rem;
                    "
                >
                    ${cat}
                </button>
            `).join('')}
        </div>
    `;


    const filteredProducts = filter === 'All' 
        ? products 
        : products.filter(p => p.category === filter);


    const productsHTML = filteredProducts.length > 0 
        ? filteredProducts.map(p => `
            <div class="product-card">
                <div style="overflow:hidden; cursor:pointer;" onclick="addToCart(${p.id})">
                    <img src="${p.img}" class="product-img" alt="${p.title}">
                    <span style="position:absolute; top:10px; left:10px; background:#000; color:#fff; padding:2px 8px; font-size:10px; border-radius:4px;">${p.category}</span>
                </div>
                <div class="product-info">
                    <h3>${p.title}</h3>
                    <p class="price">₹${p.price.toLocaleString()}</p>
                    <button class="btn" style="width:100%; margin-top:10px;" onclick="addToCart(${p.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('')
        : `<p style="text-align:center; width:100%; color:#888;">No items found in this category.</p>`;


    container.innerHTML = filterHTML + productsHTML;
}

function navigateTo(pageId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    const target = document.getElementById(pageId);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);
    }
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active-link');
        if(link.getAttribute('onclick') && link.getAttribute('onclick').includes(pageId)) {
            link.classList.add('active-link');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    

    if (pageId === 'shop') renderShop('All'); // Changed from renderShop() to renderShop('All')

    if (pageId === 'shop') renderShop();
    if (pageId === 'cart') renderCart();
    if (pageId === 'checkout') renderCheckout();
}

function addToCart(id) {
    const product = products.find(p => p.id == id);
    
    if (!product) return;

    const existingItem = cart.find(item => item.id == id);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart();
    updateCartCount();
    showToast(`Added ${product.title} to Bag`);
}

function saveCart() { 
    localStorage.setItem('anashiCart', JSON.stringify(cart)); 
}

function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    const badge = document.getElementById('nav-cart-count');
    if (badge) badge.innerText = count;
}

function renderCart() {
    const container = document.getElementById('cart-content');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 40px;"><h3 style="color:#666; margin-bottom:20px;">Your bag is empty.</h3><button class="btn" onclick="navigateTo('shop')">Start Shopping</button></div>`;
        return;
    }

    let subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let total = Math.round(subtotal * 1.18);

    let rows = cart.map(item => `
        <tr>
            <td>
                <div style="display:flex; align-items:center; gap:15px;">
                    <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
                    <div>${item.title}</div>
                </div>
            </td>
            <td>₹${item.price.toLocaleString()}</td>
            <td>
                <div style="display:flex; align-items:center; gap:5px;">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </td>
            <td>₹${(item.price * item.qty).toLocaleString()}</td>
        </tr>
    `).join('');

    container.innerHTML = `<table><thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="bill-box" style="margin-left:auto; width:100%; max-width:400px; background:#111; padding:20px;">
        <div class="bill-row" style="display:flex; justify-content:space-between; margin-bottom:10px;"><span>Subtotal</span> <span>₹${subtotal.toLocaleString()}</span></div>
        <div class="bill-row" style="display:flex; justify-content:space-between; font-weight:bold; color:#fff; font-size:1.2rem;"><span>Total</span> <span>₹${total.toLocaleString()}</span></div>
        <button class="btn" style="width:100%; margin-top:20px;" onclick="navigateTo('checkout')">Checkout</button>
    </div>`;
}

function updateQty(id, change) {
    const item = cart.find(i => i.id == id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) cart = cart.filter(i => i.id != id);
        saveCart();
        updateCartCount();
        renderCart();
    }
}

function renderCheckout() {
    const container = document.getElementById('checkout-summary');
    if (!container) return;
    let subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let total = Math.round(subtotal * 1.18);
    container.innerHTML = cart.map(item => `<div style="display:flex; justify-content:space-between; margin-bottom:10px; color:#aaa;"><span>${item.title} x${item.qty}</span> <span>₹${(item.price * item.qty).toLocaleString()}</span></div>`).join('') + 
    `<hr style="border-color:#333; margin:15px 0;"><div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.2rem; color:#fff;"><span>Total Payable</span> <span>₹${total.toLocaleString()}</span></div>`;
}

function processOrder(e) {
    e.preventDefault();
    if (cart.length === 0) return alert("Cart is empty");
    const btn = document.querySelector('#checkout-form button');
    btn.innerText = "Processing...";
    btn.style.opacity = "0.7";
    setTimeout(() => {
        btn.innerText = "Success! 🎉";
        btn.style.background = "#27ae60";
        setTimeout(() => {
            cart = []; saveCart(); updateCartCount(); navigateTo('home'); showToast("Order Placed Successfully!"); btn.innerText = "Place Order"; btn.style.background = ""; btn.style.opacity = "1";
        }, 2000);
    }, 2000);
}

function showToast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.innerText = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderShop();
    navigateTo('home');
});
