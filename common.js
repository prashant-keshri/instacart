// ==================== COMMON.JS - FreshKart Global Functions ====================

// ==================== GLOBAL VARIABLES ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

// ==================== CATEGORIES DATA ====================
const categoriesData = [
  { name: "Fruits", icon: "🍎", cat: "fruits" },
  { name: "Vegetables", icon: "🥬", cat: "vegetables" },
  { name: "Beverages", icon: "🥤", cat: "beverages" },
  { name: "Cakes", icon: "🎂", cat: "cakes" },
  { name: "Ice Cream", icon: "🍦", cat: "icecream" },
  { name: "Snacks", icon: "🍿", cat: "snacks" }
];

// ==================== CART FUNCTIONS ====================
function updatePriceBreakdown() {
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const totalDiscount = cart.reduce((sum, i) => sum + ((i.oldPrice || i.price) - i.price) * i.qty, 0);
  const deliveryCharge = subtotal > 499 ? 0 : 40;
  const platformFee = 9;
  const totalPayable = subtotal + deliveryCharge + platformFee;
  
  const breakdownBox = document.getElementById('priceBreakdownBox');
  if (breakdownBox) {
    breakdownBox.innerHTML = `
      <div class="breakdown-row"><span>Subtotal</span><span>₹${subtotal}</span></div>
      <div class="breakdown-row"><span>Total Discount</span><span>- ₹${totalDiscount}</span></div>
      <div class="breakdown-row"><span>Delivery Fee</span><span>${deliveryCharge === 0 ? 'FREE' : '₹' + deliveryCharge}</span></div>
      <div class="breakdown-row"><span>Platform Fee</span><span>₹${platformFee}</span></div>
      <div class="breakdown-row total"><span>Total Amount</span><span>₹${totalPayable}</span></div>
    `;
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount, #bottomCartCount, #mobileCartCount').forEach(el => {
    if (el) el.innerText = totalItems;
  });
  
  const cartList = document.getElementById('cartItemsList');
  if (cartList) {
    if (cart.length === 0) {
      cartList.innerHTML = '<div style="padding:30px;text-align:center;">Cart empty</div>';
    } else {
      cartList.innerHTML = cart.map(item => `
        <div class="cart-item">
          <img class="cart-item-img" src="${item.image}" onerror="this.src='https://placehold.co/60'">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="price-info">
              <span class="cart-current">₹${item.price}</span>
              ${item.oldPrice ? `<span class="cart-old">₹${item.oldPrice}</span><span class="cart-discount">${item.discountPercent || Math.round((1 - item.price / item.oldPrice) * 100)}% off</span>` : ''}
            </div>
            <div class="quantity-control">
              <button onclick="updateQty(${item.id},-1)">-</button>
              <span>${item.qty}</span>
              <button onclick="updateQty(${item.id},1)">+</button>
              <button onclick="removeItem(${item.id})" style="margin-left:8px;color:var(--red-primary);background:transparent;border:none;cursor:pointer;">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
  updatePriceBreakdown();
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateQty(id, delta) {
  let idx = cart.findIndex(i => i.id === id);
  if (idx !== -1) {
    let newQty = cart[idx].qty + delta;
    if (newQty < 1) cart.splice(idx, 1);
    else if (newQty > 20) { alert("Max 20 allowed"); return; }
    else cart[idx].qty = newQty;
    updateCartUI();
  }
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function addToCart(product) {
  let existing = cart.find(i => i.id === product.id);
  if (existing) {
    if (existing.qty + 1 > 20) { alert("Max 20 allowed"); return; }
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  alert(`${product.name} added to cart!`);
}

function openCart() {
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('overlay')?.classList.add('active');
}

function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('active');
}

// ==================== WISHLIST FUNCTIONS ====================
function toggleWishlist(productId, event) {
  if (event) event.stopPropagation();
  const idx = wishlist.indexOf(productId);
  if (idx === -1) wishlist.push(productId);
  else wishlist.splice(idx, 1);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  if (typeof refreshProductGrids === 'function') refreshProductGrids();
}

function isInWishlist(productId) {
  return wishlist.includes(productId);
}

// ==================== DARK MODE ====================
function initDarkMode() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) toggleBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function toggleDarkMode() {
  const cur = document.body.getAttribute('data-theme');
  const nxt = cur === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', nxt);
  localStorage.setItem('theme', nxt);
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) toggleBtn.innerHTML = nxt === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// ==================== HERO SLIDER ====================
function initHeroSlider() {
  const slides = [
    { title: "Fresh Groceries", sub: "40% off first order", bg: "linear-gradient(135deg,#2e7d32,#f97316)" },
    { title: "Farm Fresh Veggies", sub: "Direct from farmers", bg: "linear-gradient(135deg,#1e3c72,#2a5298)" },
    { title: "Organic Fruits Sale", sub: "30% off", bg: "linear-gradient(135deg,#d4145a,#3a1c71)" }
  ];
  const slider = document.getElementById('heroSlider');
  if (slider) {
    slider.innerHTML = slides.map(s => `
      <div class="swiper-slide hero-slide" style="background:${s.bg}">
        <div class="hero-content"><h2>${s.title}</h2><p>${s.sub}</p><button class="order-now" onclick="alert('Explore offers!')">Order Now →</button></div>
      </div>
    `).join('');
    new Swiper('.heroSwiper', { loop: true, autoplay: { delay: 3500 }, pagination: { el: '.swiper-pagination' }, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } });
  }
}

// ==================== QUICK CATEGORIES ====================
function initQuickCategories() {
  const container = document.getElementById('quickCatLinks');
  if (container) {
    container.innerHTML = categoriesData.map(c => `
      <a href="categories.html?cat=${c.cat}" class="cat-link">
        <div class="cat-icon">${c.icon}</div><span>${c.name}</span>
      </a>
    `).join('');
  }
}

// ==================== SUBSCRIPTION ====================
function initSubscriptionItems() {
  const items = [
    { img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100", name: "Milk" },
    { img: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=100", name: "Bread" },
    { img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=100", name: "Eggs" },
    { img: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=100", name: "Fruits" },
    { img: "https://images.unsplash.com/photo-1597362875127-2c6e5a8bf6f4?w=100", name: "Juice" }
  ];
  const wrap = document.getElementById('subscriptionItems');
  if (wrap) {
    wrap.innerHTML = items.map(i => `
      <div class="swiper-slide sub-item" onclick="window.location.href='subscription.html'">
        <img src="${i.img}"><div>${i.name}</div><small>daily</small>
      </div>
    `).join('');
    new Swiper('.subscriptionSwiper', { slidesPerView: 2.5, spaceBetween: 14, breakpoints: { 640: { slidesPerView: 3.5 }, 1024: { slidesPerView: 5 } } });
  }
}

// ==================== REVIEWS ====================
function initCustomerReviews() {
  const reviews = [
    { name: "Priya Sharma", avatar: "P", rating: 5, text: "FreshKart is a game changer! Daily delivery is super reliable." },
    { name: "Rahul Verma", avatar: "R", rating: 5, text: "Best grocery app, love the dark mode and smooth cart." },
    { name: "Neha Gupta", avatar: "N", rating: 4, text: "Great discounts and fresh produce. Highly recommended!" }
  ];
  const grid = document.getElementById('reviewsGrid');
  if (grid) {
    grid.innerHTML = reviews.map(r => `
      <div class="review-card">
        <div class="review-header"><div class="review-avatar">${r.avatar}</div><div><strong>${r.name}</strong><div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div></div></div>
        <div class="review-text">“${r.text}”</div>
      </div>
    `).join('');
  }
}

// ==================== COUNTDOWN TIMER ====================
function initCountdownTimer() {
  const target = new Date();
  target.setDate(target.getDate() + 5);
  setInterval(() => {
    const diff = target - new Date();
    if (diff <= 0) return;
    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');
    if (days) days.innerText = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
    if (hours) hours.innerText = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    if (minutes) minutes.innerText = String(Math.floor((diff / 60000) % 60)).padStart(2, '0');
    if (seconds) seconds.innerText = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
  }, 1000);
}

// ==================== CART EVENT BINDINGS ====================
function bindCartEvents() {
  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('bottomCartBtn')?.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  document.getElementById('mobileCartIcon')?.addEventListener('click', openCart);
  document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
  document.getElementById('overlay')?.addEventListener('click', closeCart);
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length) {
      alert(`✅ Order placed! Total ₹${cart.reduce((s,i)=>s+i.price*i.qty,0)}`);
      cart = [];
      updateCartUI();
      closeCart();
    } else alert('Cart empty');
  });
}

// ==================== SEARCH ====================
function initGlobalSearch(products) {
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(term));
      if (filtered.length) window.location.href = `description.html?id=${filtered[0].id}`;
    });
  }
}

// ==================== LOCATION ====================
function initLocationSelector() {
  document.getElementById('locationSelect')?.addEventListener('change', (e) => alert(`📍 Location changed to ${e.target.value}`));
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
  document.getElementById('backToTopBtn')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ==================== SUBSCRIPTION EXPAND ====================
function initSubscriptionExpand() {
  const expandBtn = document.getElementById('expandSubscriptionBtn');
  const minDiv = document.getElementById('subscriptionMinimized');
  const expDiv = document.getElementById('subscriptionExpanded');
  if (expandBtn && minDiv && expDiv) {
    expandBtn.addEventListener('click', () => {
      if (minDiv.style.display !== 'none') {
        minDiv.style.display = 'none';
        expDiv.style.display = 'block';
        expandBtn.innerHTML = '<span>Collapse</span> <i class="fas fa-arrow-up"></i>';
      } else {
        minDiv.style.display = 'block';
        expDiv.style.display = 'none';
        expandBtn.innerHTML = '<span>Explore plans</span> <i class="fas fa-arrow-down"></i>';
      }
    });
  }
}

// ==================== PRODUCT CARD RENDERER ====================
function renderProductCard(product) {
  const isWishlisted = wishlist.includes(product.id);
  const discountValue = product.discountPercent || Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  return `
    <div class="product-card">
      <div class="product-image" onclick="viewProduct(${product.id})">
        <img src="${product.image}" onerror="this.src='https://placehold.co/200'">
        ${discountValue ? `<div class="product-badge">${discountValue}% OFF</div>` : ''}
        <div class="wishlist-icon" onclick="event.stopPropagation();toggleWishlist(${product.id}, event)">
          <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
        </div>
      </div>
      <div class="product-info-card">
        <div class="product-name" onclick="viewProduct(${product.id})">${product.name}</div>
        <div class="price-row-card">
          <span class="current-price-card">₹${product.price}</span>
          ${product.oldPrice ? `<span class="old-price-card">₹${product.oldPrice}</span>` : ''}
        </div>
        <button class="add-to-cart-card" onclick="event.stopPropagation();addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

function viewProduct(productId) {
  let p = window.allProducts?.find(p => p.id === productId);
  if (p) {
    let filtered = recentlyViewed.filter(r => r.id !== productId);
    filtered.unshift(p);
    recentlyViewed = filtered.slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }
  window.location.href = `description.html?id=${productId}`;
}

 // ==================== INITIALIZE QUICK CATEGORIES ====================
    function initQuickCategories() {
      const categories = [
        { name: "Fruits", icon: "🍎", cat: "fruits" },
        { name: "Vegetables", icon: "🥬", cat: "vegetables" },
        { name: "Beverages", icon: "🥤", cat: "beverages" },
        { name: "Cakes", icon: "🎂", cat: "cakes" },
        { name: "Ice Cream", icon: "🍦", cat: "icecream" },
        { name: "Snacks", icon: "🍿", cat: "snacks" }
      ];
      const container = document.getElementById('quickCatLinks');
      if (container) {
        container.innerHTML = categories.map(c => `
          <a href="categories.html?cat=${c.cat}" class="cat-link">
            <div class="cat-icon">${c.icon}</div>
            <span>${c.name}</span>
          </a>
        `).join('');
      }
    }

    // ==================== SKELETON LOADING FUNCTIONS ====================

// Show skeleton loader for products grid
function showProductsSkeleton(containerId, count = 8) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    container.innerHTML += `
      <div class="product-skeleton">
        <div class="image-skeleton skeleton"></div>
        <div class="info-skeleton">
          <div class="title-skeleton skeleton"></div>
          <div class="price-skeleton skeleton"></div>
          <div class="button-skeleton skeleton"></div>
        </div>
      </div>
    `;
  }
}

// Show skeleton loader for hero slider
function showHeroSkeleton() {
  const container = document.getElementById('heroSlider');
  if (!container) return;
  
  container.innerHTML = `
    <div class="swiper-slide">
      <div class="hero-skeleton skeleton"></div>
    </div>
  `;
}

// Show skeleton loader for category links
function showCategoriesSkeleton() {
  const container = document.getElementById('quickCatLinks');
  if (!container) return;
  
  container.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    container.innerHTML += `
      <div class="cat-skeleton">
        <div class="cat-icon-skeleton skeleton"></div>
        <div class="cat-text-skeleton skeleton"></div>
      </div>
    `;
  }
}

// Show skeleton loader for recently viewed
function showRecentlyViewedSkeleton() {
  const container = document.getElementById('recentlyViewed');
  if (!container) return;
  
  container.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    container.innerHTML += `
      <div class="swiper-slide">
        <div class="recently-item-skeleton">
          <div class="image-skeleton skeleton"></div>
          <div class="text-skeleton skeleton"></div>
        </div>
      </div>
    `;
  }
}

// Show skeleton loader for subscription items
function showSubscriptionSkeleton() {
  const container = document.getElementById('subscriptionItems');
  if (!container) return;
  
  container.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    container.innerHTML += `
      <div class="swiper-slide">
        <div class="sub-skeleton">
          <div class="image-skeleton skeleton"></div>
          <div class="text-skeleton skeleton"></div>
        </div>
      </div>
    `;
  }
}

// Show skeleton loader for reviews
function showReviewsSkeleton() {
  const container = document.getElementById('reviewsGrid');
  if (!container) return;
  
  container.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    container.innerHTML += `
      <div class="review-skeleton">
        <div class="avatar-skeleton skeleton" style="margin-bottom: 12px;"></div>
        <div class="text-line-skeleton long skeleton"></div>
        <div class="text-line-skeleton short skeleton"></div>
      </div>
    `;
  }
}

// Show skeleton loader for deal zone
function showDealZoneSkeleton(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    container.innerHTML += `
      <div class="deal-skeleton">
        <div class="image-skeleton skeleton" style="height: 170px;"></div>
        <div class="info-skeleton" style="padding: 12px;">
          <div class="title-skeleton skeleton" style="height: 14px; margin-bottom: 8px;"></div>
          <div class="price-skeleton skeleton" style="height: 18px;"></div>
        </div>
      </div>
    `;
  }
}

// Show skeleton loader for orders page
function showOrdersSkeleton() {
  const container = document.getElementById('ordersContainer');
  if (!container) return;
  
  container.innerHTML = `
    <div class="page-header">
      <div class="skeleton" style="width: 200px; height: 32px; border-radius: 8px;"></div>
      <div class="skeleton" style="width: 300px; height: 16px; border-radius: 8px; margin-top: 8px;"></div>
    </div>
    <div class="orders-list">
      ${Array(3).fill(`
        <div class="order-skeleton">
          <div class="order-header-skeleton">
            <div class="id-skeleton skeleton"></div>
            <div class="status-skeleton skeleton"></div>
            <div class="price-skeleton skeleton"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Show skeleton loader for account page
function showAccountSkeleton() {
  const mainContainer = document.getElementById('accountMain');
  if (!mainContainer) return;
  
  mainContainer.innerHTML = `
    <div class="stats-skeleton">
      ${Array(4).fill(`<div class="stat-skeleton skeleton"></div>`).join('')}
    </div>
    <div class="section-header">
      <div class="skeleton" style="width: 180px; height: 24px; border-radius: 8px;"></div>
    </div>
    ${Array(3).fill(`
      <div class="order-skeleton" style="margin-bottom: 12px;">
        <div class="order-header-skeleton">
          <div class="id-skeleton skeleton"></div>
          <div class="price-skeleton skeleton"></div>
        </div>
      </div>
    `).join('')}
  `;
}

// Show skeleton loader for product detail page
function showProductDetailSkeleton() {
  const container = document.getElementById('productDetailContainer');
  if (!container) return;
  
  container.innerHTML = `
    <div class="detail-skeleton">
      <div class="gallery-skeleton">
        <div class="main-image-skeleton skeleton"></div>
        <div class="thumb-skeleton">
          <div class="skeleton"></div>
          <div class="skeleton"></div>
          <div class="skeleton"></div>
          <div class="skeleton"></div>
        </div>
      </div>
      <div class="info-skeleton">
        <div class="title-skeleton skeleton"></div>
        <div class="price-skeleton skeleton"></div>
        <div class="desc-skeleton skeleton"></div>
        <div class="info-card-skeleton">
          <div class="skeleton"></div>
          <div class="skeleton"></div>
          <div class="skeleton"></div>
          <div class="skeleton"></div>
        </div>
        <div class="button-skeleton">
          <div class="skeleton"></div>
          <div class="skeleton"></div>
        </div>
      </div>
    </div>
    <div class="section-header">
      <div class="skeleton" style="width: 200px; height: 28px; border-radius: 8px;"></div>
    </div>
    <div class="products-grid">
      ${Array(4).fill(`
        <div class="product-skeleton">
          <div class="image-skeleton skeleton" style="height: 170px;"></div>
          <div class="info-skeleton" style="padding: 12px;">
            <div class="title-skeleton skeleton" style="height: 14px; margin-bottom: 8px;"></div>
            <div class="price-skeleton skeleton" style="height: 18px;"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ==================== ORDER HELPER FUNCTIONS ====================

// Get order timeline steps
function getOrderTimeline(status) {
  const steps = [
    { name: "Order Placed", icon: "fa-check-circle", key: "placed" },
    { name: "Preparing", icon: "fa-utensils", key: "processing" },
    { name: "Shipped", icon: "fa-truck", key: "shipped" },
    { name: "Delivered", icon: "fa-home", key: "delivered" }
  ];
  
  let currentIndex = 0;
  if (status === 'processing') currentIndex = 1;
  else if (status === 'shipped') currentIndex = 2;
  else if (status === 'delivered') currentIndex = 3;
  
  return steps.map((step, idx) => ({
    ...step,
    completed: idx < currentIndex,
    active: idx === currentIndex
  }));
}

// Show cancel order modal
function showCancelModal(orderId, orderStatus, onConfirm) {
  if (orderStatus === 'delivered') {
    alert('Cannot cancel delivered orders. Please contact support.');
    return;
  }
  
  // Remove existing modal if any
  const existingModal = document.getElementById('cancelModalOverlay');
  if (existingModal) existingModal.remove();
  
  const modalHTML = `
    <div id="cancelModalOverlay" class="modal-overlay">
      <div class="cancel-modal">
        <h3>Cancel Order</h3>
        <p>Are you sure you want to cancel order <strong>${orderId}</strong>?</p>
        <textarea class="cancel-reason" id="cancelReason" rows="3" placeholder="Please tell us why you're cancelling (optional)"></textarea>
        <div class="modal-buttons">
          <button class="btn-modal-close" onclick="closeCancelModal()">No, Keep It</button>
          <button class="btn-modal-cancel" id="confirmCancelBtn">Yes, Cancel Order</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = document.getElementById('cancelModalOverlay');
  modal.classList.add('active');
  
  document.getElementById('confirmCancelBtn').onclick = () => {
    const reason = document.getElementById('cancelReason').value;
    closeCancelModal();
    if (onConfirm) onConfirm(reason);
  };
}

function closeCancelModal() {
  const modal = document.getElementById('cancelModalOverlay');
  if (modal) modal.remove();
}

// Show edit address modal
function showEditAddressModal(orderId, currentAddress, onSave) {
  // Remove existing modal if any
  const existingModal = document.getElementById('editAddressModalOverlay');
  if (existingModal) existingModal.remove();
  
  const modalHTML = `
    <div id="editAddressModalOverlay" class="modal-overlay">
      <div class="edit-address-modal">
        <h3><i class="fas fa-map-marker-alt"></i> Edit Delivery Address</h3>
        <div class="address-form-group">
          <label>Full Name</label>
          <input type="text" id="editAddressName" placeholder="Recipient name" value="Rahul Sharma">
        </div>
        <div class="address-form-group">
          <label>Phone Number</label>
          <input type="tel" id="editAddressPhone" placeholder="Phone number" value="+91 98765 43210">
        </div>
        <div class="address-form-group">
          <label>Full Address</label>
          <textarea id="editAddressText" rows="3" placeholder="Street, Area, City, Pincode">${currentAddress}</textarea>
        </div>
        <div class="modal-buttons">
          <button class="btn-modal-close" onclick="closeEditAddressModal()">Cancel</button>
          <button class="btn-modal-cancel" id="saveAddressBtn" style="background: var(--green-primary);">Save Changes</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = document.getElementById('editAddressModalOverlay');
  modal.classList.add('active');
  
  document.getElementById('saveAddressBtn').onclick = () => {
    const newAddress = document.getElementById('editAddressText').value;
    const name = document.getElementById('editAddressName').value;
    const phone = document.getElementById('editAddressPhone').value;
    const fullAddress = `${name}, ${phone}\n${newAddress}`;
    closeEditAddressModal();
    if (onSave) onSave(fullAddress);
  };
}

function closeEditAddressModal() {
  const modal = document.getElementById('editAddressModalOverlay');
  if (modal) modal.remove();
}

// Check if order can be edited (not shipped or delivered)
function canEditOrder(orderStatus) {
  return orderStatus === 'processing' || orderStatus === 'placed';
}

// Get order updates list
function getOrderUpdates(orderStatus, orderDate) {
  const updates = [
    { title: "Order Confirmed", date: orderDate, icon: "fa-check-circle", color: "var(--green-primary)" }
  ];
  
  if (orderStatus === 'processing' || orderStatus === 'shipped' || orderStatus === 'delivered') {
    updates.push({ title: "Order is being prepared", date: orderDate, icon: "fa-utensils", color: "var(--orange-primary)" });
  }
  if (orderStatus === 'shipped' || orderStatus === 'delivered') {
    updates.push({ title: "Order Shipped", date: orderDate, icon: "fa-truck", color: "var(--blue-primary)" });
  }
  if (orderStatus === 'delivered') {
    updates.push({ title: "Order Delivered", date: orderDate, icon: "fa-home", color: "var(--green-primary)" });
  }
  
  return updates;
}

// Render timeline HTML
function renderOrderTimeline(status) {
  const timeline = getOrderTimeline(status);
  return `
    <div class="order-timeline">
      <div class="timeline-steps">
        ${timeline.map(step => `
          <div class="timeline-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}">
            <div class="step-icon"><i class="fas ${step.icon}"></i></div>
            <div class="step-label">${step.name}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Render updates HTML
function renderOrderUpdates(status, date) {
  const updates = getOrderUpdates(status, date);
  return `
    <div class="price-breakdown-section">
      <div class="price-breakdown-title">Order Updates</div>
      ${updates.map(update => `
        <div class="update-item">
          <div class="update-icon"><i class="fas ${update.icon}" style="color: ${update.color};"></i></div>
          <div class="update-content">
            <div class="update-title">${update.title}</div>
            <div class="update-date">${update.date}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Render price breakdown HTML
function renderOrderPriceBreakdown(order) {
  return `
    <div class="price-breakdown-section">
      <div class="price-breakdown-title">Price Details</div>
      <div class="breakdown-row"><span>Total MRP</span><span>₹${order.subtotal + order.discount}</span></div>
      <div class="breakdown-row"><span>Discount</span><span>- ₹${order.discount}</span></div>
      <div class="breakdown-row"><span>Delivery Fee</span><span>${order.deliveryFee === 0 ? 'FREE' : '₹' + order.deliveryFee}</span></div>
      <div class="breakdown-row"><span>Platform Fee</span><span>₹${order.platformFee}</span></div>
      <div class="breakdown-row total"><span>Total Amount</span><span>₹${order.total}</span></div>
    </div>
  `;
}


