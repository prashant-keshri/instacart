// ==================== COMMON.JS - FreshKart Global Functions ====================

// ==================== EDITABLE CONFIGURATION ====================
const SITE_CONFIG = {
  FREE_DELIVERY_THRESHOLD: 499,
  MAX_CART_QUANTITY: 20,
  PLATFORM_FEE: 9,
  DELIVERY_CHARGE: 40,
  DEFAULT_INITIAL_ITEMS: 12,
  DEFAULT_LOAD_MORE_ITEMS: 6,
  DEFAULT_MAX_CYCLES: 10,
  DEFAULT_THEME: 'dark',
  STORAGE_KEYS: {
    CART: 'freshkart_cart',
    WISHLIST: 'freshkart_wishlist',
    RECENTLY_VIEWED: 'freshkart_recently',
    THEME: 'freshkart_theme',
    USER_DATA: 'freshkart_user_data',
    ADDRESSES: 'freshkart_addresses',
    ORDERS: 'freshkart_orders'
  }
};

// ==================== GLOBAL VARIABLES ====================
let cart = [];
let wishlist = [];
let recentlyViewed = [];

// ==================== STORAGE FUNCTIONS ====================
function loadAllData() {
  try {
    const savedCart = localStorage.getItem(SITE_CONFIG.STORAGE_KEYS.CART);
    cart = savedCart ? JSON.parse(savedCart) : [];
    if (!Array.isArray(cart)) cart = [];
    
    const savedWishlist = localStorage.getItem(SITE_CONFIG.STORAGE_KEYS.WISHLIST);
    wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    if (!Array.isArray(wishlist)) wishlist = [];
    
    const savedRecentlyViewed = localStorage.getItem(SITE_CONFIG.STORAGE_KEYS.RECENTLY_VIEWED);
    recentlyViewed = savedRecentlyViewed ? JSON.parse(savedRecentlyViewed) : [];
    if (!Array.isArray(recentlyViewed)) recentlyViewed = [];
  } catch(e) {
    console.error('Storage error:', e);
    cart = [];
    wishlist = [];
    recentlyViewed = [];
  }
}

function saveCart() {
  localStorage.setItem(SITE_CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
}

function saveWishlist() {
  localStorage.setItem(SITE_CONFIG.STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
}

function saveRecentlyViewed() {
  localStorage.setItem(SITE_CONFIG.STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewed));
}

// ==================== CART FUNCTIONS ====================
function updatePriceBreakdown() {
  const subtotal = cart.reduce((sum, i) => sum + ((i.price || 0) * (i.qty || 0)), 0);
  const totalDiscount = cart.reduce((sum, i) => {
    const oldPrice = i.oldPrice || i.price || 0;
    const discountAmount = (oldPrice - (i.price || 0)) * (i.qty || 0);
    return sum + (discountAmount > 0 ? discountAmount : 0);
  }, 0);
  const deliveryCharge = subtotal > SITE_CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : SITE_CONFIG.DELIVERY_CHARGE;
  const totalPayable = subtotal + deliveryCharge + SITE_CONFIG.PLATFORM_FEE;
  
  const breakdownBox = document.getElementById('priceBreakdownBox');
  if (breakdownBox) {
    breakdownBox.innerHTML = `
      <div class="breakdown-row"><span>Subtotal</span><span>₹${Math.round(subtotal)}</span></div>
      <div class="breakdown-row"><span>Total Discount</span><span>- ₹${Math.round(totalDiscount)}</span></div>
      <div class="breakdown-row"><span>Delivery Fee</span><span>${deliveryCharge === 0 ? 'FREE' : '₹' + deliveryCharge}</span></div>
      <div class="breakdown-row"><span>Platform Fee</span><span>₹${SITE_CONFIG.PLATFORM_FEE}</span></div>
      <div class="breakdown-row total"><span>Total Amount</span><span>₹${Math.round(totalPayable)}</span></div>
    `;
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + (i.qty || 0), 0);
  
  document.querySelectorAll('#cartCount, #bottomCartCount, #mobileCartCount').forEach(el => {
    if (el) el.innerText = totalItems;
  });
  
  const cartList = document.getElementById('cartItemsList');
  if (cartList) {
    if (cart.length === 0) {
      cartList.innerHTML = '<div style="padding:30px;text-align:center;">Cart empty</div>';
    } else {
      cartList.innerHTML = cart.map(item => {
        const discountPercent = item.discountPercent || (item.oldPrice ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0);
        return `
          <div class="cart-item">
            <img class="cart-item-img" src="${item.image || ''}" onerror="this.src='https://placehold.co/60'">
            <div class="cart-item-details">
              <div class="cart-item-name">${escapeHtml(item.name || 'Product')}</div>
              <div class="price-info">
                <span class="cart-current">₹${item.price || 0}</span>
                ${item.oldPrice ? `<span class="cart-old">₹${item.oldPrice}</span><span class="cart-discount">${discountPercent}% off</span>` : ''}
              </div>
              <div class="quantity-control">
                <button onclick="updateQty(${item.id},-1)">-</button>
                <span>${item.qty || 0}</span>
                <button onclick="updateQty(${item.id},1)">+</button>
                <button onclick="removeItem(${item.id})" style="margin-left:8px;color:var(--red-primary);background:transparent;border:none;cursor:pointer;">Remove</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
  updatePriceBreakdown();
}

function updateQty(id, delta) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx !== -1) {
    let newQty = (cart[idx].qty || 0) + delta;
    if (newQty < 1) {
      cart.splice(idx, 1);
    } else if (newQty > SITE_CONFIG.MAX_CART_QUANTITY) {
      alert(`Max ${SITE_CONFIG.MAX_CART_QUANTITY} allowed`);
      return;
    } else {
      cart[idx].qty = newQty;
    }
    saveCart();
    updateCartUI();
  }
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function addToCart(product) {
  if (!product || !product.id) return;
  
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    if ((existing.qty || 0) + 1 > SITE_CONFIG.MAX_CART_QUANTITY) {
      alert(`Max ${SITE_CONFIG.MAX_CART_QUANTITY} allowed`);
      return;
    }
    existing.qty = (existing.qty || 0) + 1;
  } else {
    cart.push({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      oldPrice: product.oldPrice,
      discountPercent: product.discountPercent,
      image: product.image, 
      qty: 1 
    });
  }
  saveCart();
  updateCartUI();
  alert(`${product.name} added to cart!`);
}

function openCart() {
  updateCartUI();
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('active');
}

function closeCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

// ==================== WISHLIST FUNCTIONS ====================
function toggleWishlist(productId, event) {
  if (event) event.stopPropagation();
  
  const idx = wishlist.indexOf(productId);
  if (idx === -1) {
    wishlist.push(productId);
  } else {
    wishlist.splice(idx, 1);
  }
  saveWishlist();
  
  if (event && event.target) {
    const icon = event.target.closest('.wishlist-icon')?.querySelector('i');
    if (icon) {
      if (idx === -1) {
        icon.classList.remove('far');
        icon.classList.add('fas');
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
      }
    }
  }
}

function isInWishlist(productId) {
  return wishlist.includes(productId);
}

function getWishlistProducts(allProducts) {
  if (!allProducts || !Array.isArray(allProducts)) return [];
  return allProducts.filter(p => wishlist.includes(p.id));
}

function refreshWishlistDisplay() {
  const wishlistStat = document.querySelector('.stat-card .stat-value');
  if (wishlistStat && wishlistStat.closest('.stat-card')?.querySelector('.stat-label')?.innerText === 'Wishlist') {
    wishlistStat.innerText = wishlist.length;
  }
}

// ==================== DARK MODE ====================
function initDarkMode() {
  const savedTheme = localStorage.getItem(SITE_CONFIG.STORAGE_KEYS.THEME) || SITE_CONFIG.DEFAULT_THEME;
  document.body.setAttribute('data-theme', savedTheme);
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) toggleBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function toggleDarkMode() {
  const cur = document.body.getAttribute('data-theme');
  const nxt = cur === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', nxt);
  localStorage.setItem(SITE_CONFIG.STORAGE_KEYS.THEME, nxt);
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) toggleBtn.innerHTML = nxt === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// ==================== HERO SLIDER ====================
function initHeroSlider() {
  const sliderContainer = document.getElementById('heroSlider');
  if (!sliderContainer) return;
  
  const slides = [
    { title: "Fresh Groceries", sub: "40% off first order", bg: "linear-gradient(135deg,#2e7d32,#f97316)" },
    { title: "Farm Fresh Veggies", sub: "Direct from farmers", bg: "linear-gradient(135deg,#1e3c72,#2a5298)" },
    { title: "Organic Fruits Sale", sub: "30% off", bg: "linear-gradient(135deg,#d4145a,#3a1c71)" }
  ];
  
  sliderContainer.innerHTML = slides.map(s => `
    <div class="swiper-slide hero-slide" style="background:${s.bg}">
      <div class="hero-content"><h2>${s.title}</h2><p>${s.sub}</p><button class="order-now" onclick="alert('Explore offers!')">Order Now →</button></div>
    </div>
  `).join('');
  
  if (typeof Swiper !== 'undefined') {
    new Swiper('.heroSwiper', { 
      loop: true, 
      autoplay: { delay: 3500 }, 
      pagination: { el: '.swiper-pagination' }, 
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } 
    });
  }
}

// ==================== QUICK CATEGORIES ====================
function initQuickCategories() {
  const container = document.getElementById('quickCatLinks');
  if (!container) return;
  
  const categories = [
    { name: "Fruits", icon: "🍎", cat: "fruits" },
    { name: "Vegetables", icon: "🥬", cat: "vegetables" },
    { name: "Beverages", icon: "🥤", cat: "beverages" },
    { name: "Cakes", icon: "🎂", cat: "cakes" },
    { name: "Ice Cream", icon: "🍦", cat: "icecream" },
    { name: "Snacks", icon: "🍿", cat: "snacks" }
  ];
  
  container.innerHTML = categories.map(c => `
    <a href="categories.html?cat=${c.cat}" class="cat-link">
      <div class="cat-icon">${c.icon}</div><span>${c.name}</span>
    </a>
  `).join('');
}

// ==================== SUBSCRIPTION ITEMS ====================
function initSubscriptionItems() {
  const container = document.getElementById('subscriptionItems');
  if (!container) return;
  
  const items = [
    { img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100", name: "Milk" },
    { img: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=100", name: "Bread" },
    { img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=100", name: "Eggs" },
    { img: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=100", name: "Fruits" },
    { img: "https://images.unsplash.com/photo-1597362875127-2c6e5a8bf6f4?w=100", name: "Juice" }
  ];
  
  container.innerHTML = items.map(i => `
    <div class="swiper-slide sub-item" onclick="window.location.href='subscription.html'">
      <img src="${i.img}"><div>${i.name}</div><small>daily</small>
    </div>
  `).join('');
  
  if (typeof Swiper !== 'undefined') {
    new Swiper('.subscriptionSwiper', { 
      slidesPerView: 2.5, 
      spaceBetween: 14, 
      breakpoints: { 640: { slidesPerView: 3.5 }, 1024: { slidesPerView: 5 } } 
    });
  }
}

// ==================== CUSTOMER REVIEWS ====================
function initCustomerReviews() {
  const container = document.getElementById('reviewsGrid');
  if (!container) return;
  
  const reviews = [
    { name: "Priya Sharma", avatar: "P", rating: 5, text: "FreshKart is a game changer! Daily delivery is super reliable." },
    { name: "Rahul Verma", avatar: "R", rating: 5, text: "Best grocery app, love the dark mode and smooth cart." },
    { name: "Neha Gupta", avatar: "N", rating: 4, text: "Great discounts and fresh produce. Highly recommended!" }
  ];
  
  container.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-header"><div class="review-avatar">${r.avatar}</div><div><strong>${r.name}</strong><div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div></div></div>
      <div class="review-text">“${r.text}”</div>
    </div>
  `).join('');
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
  const cartBtn = document.getElementById('cartBtn');
  const bottomCartBtn = document.getElementById('bottomCartBtn');
  const mobileCartIcon = document.getElementById('mobileCartIcon');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const overlay = document.getElementById('overlay');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (bottomCartBtn) bottomCartBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  if (mobileCartIcon) mobileCartIcon.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length) {
        alert(`✅ Order placed! Total ₹${cart.reduce((s,i)=>s+i.price*i.qty,0)}`);
        cart = [];
        saveCart();
        updateCartUI();
        closeCart();
      } else {
        alert('Cart empty');
      }
    });
  }
}

// ==================== SEARCH ====================
function initGlobalSearch(products) {
  const searchInput = document.getElementById('globalSearch');
  if (searchInput && products) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = products.filter(p => p.name && p.name.toLowerCase().includes(term));
      if (filtered.length) window.location.href = `description.html?id=${filtered[0].id}`;
    });
  }
}

// ==================== LOCATION ====================
function initLocationSelector() {
  const locationSelect = document.getElementById('locationSelect');
  if (locationSelect) {
    locationSelect.addEventListener('change', (e) => alert(`📍 Location changed to ${e.target.value}`));
  }
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
  const backBtn = document.getElementById('backToTopBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
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
  if (!product) return '';
  const isWishlisted = wishlist.includes(product.id);
  const discountValue = product.discountPercent || (product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0);
  return `
    <div class="product-card" data-product-id="${product.id}">
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
  window.location.href = `description.html?id=${productId}`;
}

// ==================== SKELETON LOADING FUNCTIONS ====================
function showProductsSkeleton(containerId, count = 8) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '<div class="products-skeleton-grid">' + Array(count).fill(`
    <div class="product-skeleton">
      <div class="image-skeleton skeleton"></div>
      <div class="info-skeleton">
        <div class="title-skeleton skeleton"></div>
        <div class="price-skeleton skeleton"></div>
        <div class="button-skeleton skeleton"></div>
      </div>
    </div>
  `).join('') + '</div>';
}

function showHeroSkeleton() {
  const container = document.getElementById('heroSlider');
  if (!container) return;
  container.innerHTML = `<div class="swiper-slide"><div class="hero-skeleton skeleton"></div></div>`;
}

function showCategoriesSkeleton() {
  const container = document.getElementById('quickCatLinks');
  if (!container) return;
  container.innerHTML = Array(6).fill(`<div class="cat-skeleton"><div class="cat-icon-skeleton skeleton"></div><div class="cat-text-skeleton skeleton"></div></div>`).join('');
}

function showRecentlyViewedSkeleton() {
  const container = document.getElementById('recentlyViewed');
  if (!container) return;
  container.innerHTML = Array(8).fill(`<div class="swiper-slide"><div class="recently-item-skeleton"><div class="image-skeleton skeleton"></div><div class="text-skeleton skeleton"></div></div></div>`).join('');
}

function showSubscriptionSkeleton() {
  const container = document.getElementById('subscriptionItems');
  if (!container) return;
  container.innerHTML = Array(8).fill(`<div class="swiper-slide"><div class="sub-skeleton"><div class="image-skeleton skeleton"></div><div class="text-skeleton skeleton"></div></div></div>`).join('');
}

function showReviewsSkeleton() {
  const container = document.getElementById('reviewsGrid');
  if (!container) return;
  container.innerHTML = Array(5).fill(`<div class="review-skeleton"><div class="avatar-skeleton skeleton"></div><div class="text-line-skeleton long skeleton"></div><div class="text-line-skeleton short skeleton"></div></div>`).join('');
}

// ==================== SHOW MORE MANAGER CLASS ====================
class ShowMoreManager {
  constructor(containerId, buttonId, getFilteredProducts, options = {}) {
    this.containerId = containerId;
    this.buttonId = buttonId;
    this.getFilteredProducts = getFilteredProducts;
    this.options = {
      initialItems: options.initialItems || SITE_CONFIG.DEFAULT_INITIAL_ITEMS,
      loadMoreItems: options.loadMoreItems || SITE_CONFIG.DEFAULT_LOAD_MORE_ITEMS,
      maxCycles: options.maxCycles || SITE_CONFIG.DEFAULT_MAX_CYCLES,
      showCycleNotification: options.showCycleNotification !== undefined ? options.showCycleNotification : true
    };
    this.currentDisplayedIds = [];
    this.availableProductsPool = [];
    this.cycleCount = 1;
    this.isActive = true;
    this.allProductsList = [];
  }
  
  init() { this.reset(); this.bindEvents(); }
  
  reset() {
    this.currentDisplayedIds = [];
    this.cycleCount = 1;
    this.isActive = true;
    const filtered = this.getFilteredProducts();
    this.allProductsList = [...filtered];
    if (filtered.length === 0) { this.showEmptyState(); return; }
    this.availableProductsPool = this.shuffleArray([...filtered]);
    this.loadInitialProducts();
    this.updateButtonState();
  }
  
  loadInitialProducts() {
    const initialProducts = this.availableProductsPool.splice(0, this.options.initialItems);
    this.currentDisplayedIds = initialProducts.map(p => p.id);
    const container = document.getElementById(this.containerId);
    if (container) container.innerHTML = initialProducts.map(p => renderProductCard(p)).join('');
  }
  
  loadMore() {
    if (!this.isActive) return;
    let newProducts = this.availableProductsPool.splice(0, this.options.loadMoreItems);
    if (newProducts.length === 0) {
      if (this.cycleCount < this.options.maxCycles) { this.startNewCycle(); } 
      else { this.complete(); }
      return;
    }
    newProducts.forEach(p => this.currentDisplayedIds.push(p.id));
    const container = document.getElementById(this.containerId);
    if (container) {
      container.insertAdjacentHTML('beforeend', newProducts.map(p => renderProductCard(p)).join(''));
    }
    this.updateButtonState();
  }
  
  startNewCycle() {
    this.cycleCount++;
    this.currentDisplayedIds = [];
    this.availableProductsPool = this.shuffleArray([...this.allProductsList]);
    const newInitialProducts = this.availableProductsPool.splice(0, this.options.initialItems);
    this.currentDisplayedIds = newInitialProducts.map(p => p.id);
    const container = document.getElementById(this.containerId);
    if (container) container.innerHTML = newInitialProducts.map(p => renderProductCard(p)).join('');
    if (this.options.showCycleNotification) this.showNotification(`🎉 Round ${this.cycleCount} started! Loading fresh random products...`);
    this.updateButtonState();
  }
  
  complete() {
    this.isActive = false;
    const button = document.getElementById(this.buttonId);
    if (button) { button.textContent = "🏁 All Products Explored!"; button.disabled = true; }
    if (this.options.showCycleNotification) this.showNotification(`✨ You've explored all ${this.cycleCount} cycles! ✨`);
  }
  
  showEmptyState() {
    const container = document.getElementById(this.containerId);
    if (container) container.innerHTML = '<div class="empty-state">No products available in this category</div>';
    const button = document.getElementById(this.buttonId);
    if (button) button.style.display = 'none';
  }
  
  updateButtonState() {
    const button = document.getElementById(this.buttonId);
    if (!button) return;
    if (this.availableProductsPool.length === 0) {
      if (this.cycleCount < this.options.maxCycles) {
        button.textContent = `🔄 Start Round ${this.cycleCount + 1} (${this.options.loadMoreItems} new) →`;
        button.disabled = false;
      } else { button.textContent = "🏁 Complete!"; button.disabled = true; }
    } else {
      const remaining = Math.min(this.options.loadMoreItems, this.availableProductsPool.length);
      button.textContent = `Show More (${remaining} more) → Round ${this.cycleCount}`;
      button.disabled = false;
    }
  }
  
  showNotification(message) {
    const existingBanner = document.querySelector('.cycle-notification');
    if (existingBanner) existingBanner.remove();
    const banner = document.createElement('div');
    banner.className = 'info-banner cycle-notification';
    banner.innerHTML = `<i class="fas fa-sync-alt"></i> ${message}`;
    const container = document.querySelector(`#${this.containerId}`)?.closest('.container') || document.querySelector('.container');
    if (container) {
      container.insertBefore(banner, document.getElementById(this.containerId));
      setTimeout(() => banner.remove(), 3000);
    }
  }
  
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  refresh() { this.reset(); }
  
  bindEvents() {
    const button = document.getElementById(this.buttonId);
    if (button) {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      newButton.addEventListener('click', () => this.loadMore());
    }
  }
}

function createShowMoreManager(name, containerId, buttonId, getFilteredProducts, options = {}) {
  const manager = new ShowMoreManager(containerId, buttonId, getFilteredProducts, options);
  if (!window.showMoreManagers) window.showMoreManagers = {};
  window.showMoreManagers[name] = manager;
  return manager;
}

function refreshAllShowMoreManagers() {
  if (window.showMoreManagers) {
    Object.values(window.showMoreManagers).forEach(manager => manager.refresh());
  }
}

// ==================== MAIN INITIALIZATION ====================
function initCommon(productsData, customInitCallback) {
  loadAllData();
  initDarkMode();
  updateCartUI();
  if (customInitCallback) customInitCallback();
}

// ==================== HELPER FUNCTIONS ====================
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ==================== EXPOSE GLOBALS ====================
window.SITE_CONFIG = SITE_CONFIG;
window.cart = cart;
window.wishlist = wishlist;
window.loadAllData = loadAllData;
window.saveCart = saveCart;
window.saveWishlist = saveWishlist;
window.updateCartUI = updateCartUI;
window.updateQty = updateQty;
window.removeItem = removeItem;
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.isInWishlist = isInWishlist;
window.getWishlistProducts = getWishlistProducts;
window.refreshWishlistDisplay = refreshWishlistDisplay;
window.viewProduct = viewProduct;
window.openCart = openCart;
window.closeCart = closeCart;
window.renderProductCard = renderProductCard;
window.createShowMoreManager = createShowMoreManager;
window.refreshAllShowMoreManagers = refreshAllShowMoreManagers;
window.initHeroSlider = initHeroSlider;
window.initQuickCategories = initQuickCategories;
window.initSubscriptionItems = initSubscriptionItems;
window.initCustomerReviews = initCustomerReviews;
window.initCountdownTimer = initCountdownTimer;
window.initSubscriptionExpand = initSubscriptionExpand;
window.initLocationSelector = initLocationSelector;
window.initBackToTop = initBackToTop;
window.bindCartEvents = bindCartEvents;
window.initGlobalSearch = initGlobalSearch;
window.showProductsSkeleton = showProductsSkeleton;
window.showHeroSkeleton = showHeroSkeleton;
window.showCategoriesSkeleton = showCategoriesSkeleton;
window.showRecentlyViewedSkeleton = showRecentlyViewedSkeleton;
window.showSubscriptionSkeleton = showSubscriptionSkeleton;
window.showReviewsSkeleton = showReviewsSkeleton;