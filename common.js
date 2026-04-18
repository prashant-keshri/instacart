// ==================== COMMON.JS - FreshKart Global Functions ====================
// ==================== SECTION 1: EDITABLE CONFIGURATION ====================
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

// ==================== SECTION 2: GLOBAL VARIABLES ====================
let cart = [];
let wishlist = [];
let recentlyViewed = [];
let allProductsData = [];

// ==================== SECTION 3: STORAGE FUNCTIONS ====================
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

// ==================== SECTION 4: PRODUCT LOADING FROM JSON ====================
async function loadProductsFromJSON() {
  try {
    const response = await fetch('product.json');
    const data = await response.json();
    allProductsData = data.products.map(p => ({
      id: p.id, name: p.name, price: p.price, oldPrice: p.oldPrice,
      discountPercent: p.discountPercent || Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100),
      image: p.image, category: p.category, rating: p.rating,
      isFeatured: p.isFeatured || false, isBestSelling: p.isBestSelling || false,
      isNewArrival: p.isNewArrival || false, unit: p.unit, brand: p.brand
    }));
    window.allProducts = allProductsData;
    return true;
  } catch(e) {
    console.log('Using fallback products');
    allProductsData = [
      { id: 1, name: "Organic Apples", price: 120, oldPrice: 150, discountPercent: 20, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200", category: "fruits", isFeatured: true, isBestSelling: true },
      { id: 2, name: "Fresh Bananas", price: 49, oldPrice: 60, discountPercent: 18, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200", category: "fruits", isFeatured: true, isBestSelling: true }
    ];
    window.allProducts = allProductsData;
    return false;
  }
}

// ==================== SECTION 5: CART FUNCTIONS ====================
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
  return { subtotal, totalDiscount, deliveryCharge, totalPayable };
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
                <button onclick="window.updateQty(${item.id},-1)">-</button>
                <span>${item.qty || 0}</span>
                <button onclick="window.updateQty(${item.id},1)">+</button>
                <button onclick="window.removeItem(${item.id})" style="margin-left:8px;color:var(--red-primary);background:transparent;border:none;cursor:pointer;">Remove</button>
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
  showToast(`${product.name} added to cart!`);
}

function showToast(message) {
  let toast = document.querySelector('.custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--green-primary);color:white;padding:10px 20px;border-radius:40px;z-index:2000;font-size:14px;opacity:0;transition:opacity 0.3s;';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

// ==================== SECTION 6: CART SIDEBAR FUNCTIONS ====================
function openCart() {
  updateCartUI();
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function bindCartEvents() {
  const cartBtn = document.getElementById('cartBtn');
  const bottomCartBtn = document.getElementById('bottomCartBtn');
  const mobileCartIcon = document.getElementById('mobileCartIcon');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const overlay = document.getElementById('overlay');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (cartBtn) {
    const newBtn = cartBtn.cloneNode(true);
    cartBtn.parentNode.replaceChild(newBtn, cartBtn);
    newBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  }
  if (bottomCartBtn) {
    const newBottomBtn = bottomCartBtn.cloneNode(true);
    bottomCartBtn.parentNode.replaceChild(newBottomBtn, bottomCartBtn);
    newBottomBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  }
  if (mobileCartIcon) {
    const newMobileIcon = mobileCartIcon.cloneNode(true);
    mobileCartIcon.parentNode.replaceChild(newMobileIcon, mobileCartIcon);
    newMobileIcon.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  }
  if (closeCartBtn) {
    const newCloseBtn = closeCartBtn.cloneNode(true);
    closeCartBtn.parentNode.replaceChild(newCloseBtn, closeCartBtn);
    newCloseBtn.addEventListener('click', closeCart);
  }
  if (overlay) {
    const newOverlay = overlay.cloneNode(true);
    overlay.parentNode.replaceChild(newOverlay, overlay);
    newOverlay.addEventListener('click', closeCart);
  }
  if (checkoutBtn) {
    const newCheckoutBtn = checkoutBtn.cloneNode(true);
    checkoutBtn.parentNode.replaceChild(newCheckoutBtn, checkoutBtn);
    newCheckoutBtn.addEventListener('click', () => {
      if (cart.length) {
        alert(`✅ Order placed! Total ₹${cart.reduce((s,i)=>s+i.price*i.qty,0)}`);
        cart = [];
        saveCart();
        updateCartUI();
        closeCart();
        if (window.location.pathname.includes('orders.html')) {
          location.reload();
        }
      } else {
        alert('Cart empty');
      }
    });
  }
}

// ==================== SECTION 7: WISHLIST FUNCTIONS ====================
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
  
  // Refresh any active show more managers
  if (window.showMoreManagers) {
    Object.values(window.showMoreManagers).forEach(manager => {
      if (manager && typeof manager.refresh === 'function') manager.refresh();
    });
  }
}

function isInWishlist(productId) {
  return wishlist.includes(productId);
}

function getWishlistProducts() {
  if (!allProductsData || !Array.isArray(allProductsData)) return [];
  return allProductsData.filter(p => wishlist.includes(p.id));
}

// ==================== SECTION 8: DARK MODE ====================
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

// ==================== SECTION 9: PRODUCT CARD RENDERER ====================
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
        <div class="product-name" onclick="viewProduct(${product.id})">${escapeHtml(product.name)}</div>
        <div class="price-row-card">
          <span class="current-price-card">₹${product.price}</span>
          ${product.oldPrice ? `<span class="old-price-card">₹${product.oldPrice}</span>` : ''}
        </div>
        <button class="add-to-cart-card" onclick="event.stopPropagation();addToCart({id:${product.id},name:'${escapeHtml(product.name)}',price:${product.price},oldPrice:${product.oldPrice || product.price},discountPercent:${discountValue},image:'${product.image}'})">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

function viewProduct(productId) {
  window.location.href = `description.html?id=${productId}`;
}

// ==================== SECTION 10: SHOW MORE MANAGER CLASS (INFINITE LOADING) ====================
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

// ==================== SECTION 11: SKELETON LOADING FUNCTIONS ====================
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

// ==================== SECTION 12: HEADER COMPONENTS ====================
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (searchInput && allProductsData) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allProductsData.filter(p => p.name && p.name.toLowerCase().includes(term));
      if (filtered.length) window.location.href = `description.html?id=${filtered[0].id}`;
    });
  }
}

function initLocationSelector() {
  const locationSelect = document.getElementById('locationSelect');
  if (locationSelect) {
    locationSelect.addEventListener('change', (e) => showToast(`📍 Location changed to ${e.target.value}`));
  }
}

// ==================== SECTION 13: MAIN INITIALIZATION ====================
async function initCommon(customInitCallback) {
  await loadProductsFromJSON();
  loadAllData();
  initDarkMode();
  updateCartUI();
  bindCartEvents();
  initGlobalSearch();
  initLocationSelector();
  if (customInitCallback) customInitCallback();
}

// ==================== SECTION 14: HELPER FUNCTIONS ====================
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ==================== SECTION 15: EXPOSE GLOBALS ====================
window.SITE_CONFIG = SITE_CONFIG;
window.cart = cart;
window.wishlist = wishlist;
window.allProductsData = allProductsData;
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
window.viewProduct = viewProduct;
window.openCart = openCart;
window.closeCart = closeCart;
window.renderProductCard = renderProductCard;
window.createShowMoreManager = createShowMoreManager;
window.showProductsSkeleton = showProductsSkeleton;
window.showHeroSkeleton = showHeroSkeleton;
window.showCategoriesSkeleton = showCategoriesSkeleton;
window.initCommon = initCommon;
window.initDarkMode = initDarkMode;
window.toggleDarkMode = toggleDarkMode;
window.bindCartEvents = bindCartEvents;